import mongoose, { ObjectId } from "mongoose";
import { IQuiz } from "../models/quiz.model";
import { IQuestion, IQuizDetails } from "../models/quizDetails.model";
import QuizRepository from "../repository/quiz.repository";
import QuizDetailsRepository from "../repository/quizDetails.repository";
import { EditQuizFilters, QuizFilters } from "../types/interfaces";
import quizRepository from "../repository/quiz.repository";
import CommentRepository from "../repository/comment.repository";
import RatingRepository from "../repository/rating.repository";
import { withTransaction } from "../utils/transaction";
import userRepository from "../repository/user.repository";

const ValidationService = require("./validation.service");
const UserService = require("./user.service");

const calculatePoints = (time: number, difficulty: string, length: number) => {
  const difficultyModifier =
    difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  let points = Math.round((difficultyModifier * (4 + 10 / time) * length) / 3);
  points = Math.max(5, Math.min(points, 90));

  return points;
};

const shuffleQuizzes = (quizzes: any[]): void => {
  for (let i = quizzes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizzes[i], quizzes[j]] = [quizzes[j], quizzes[i]];
  }
};

class QuizService {
  async createQuiz(
    userId: ObjectId,
    title: string,
    description: string,
    time: number,
    questions: IQuestion[],
    difficulty: string,
    category: string
  ): Promise<IQuiz> {
    return withTransaction(async (session) => {
      if (title.length < 5 || title.length > 50) {
        throw new Error("Tytuł Quizu musi wynosić od 5 do 50 znaków.");
      }
      if (time < 3 || time > 10) {
        throw new Error(
          "Czas przeznaczony na Quiz musi wynosić od 3 do 10 minut."
        );
      }
      if (questions.length < 3 || questions.length > 15) {
        throw new Error(
          "Quiz musi składać się z minimum 3 pytań, a maksymalnie z 15."
        );
      }

      const quizDetails = await QuizDetailsRepository.create(questions, {
        session,
      });

      const quizData = {
        title,
        description,
        time,
        points: calculatePoints(time, difficulty, questions.length),
        difficulty,
        category,
        createdBy: userId,
        quizDetails: quizDetails._id,
      };

      const quiz = await QuizRepository.create(quizData, { session });

      if (!quiz || !quizDetails) throw new Error("Invalid quiz data.");

      await userRepository.addOrSubstractCreatedQuizzes(userId, 1, { session });
      const createdQuizzesMessage = await UserService.handleAchievementUpdate(
        userId,
        "Stwórz Quizy",
        1,
        session
      );

      return { quiz, createdQuizzesMessage };
    });
  }

  async editQuiz(
    userId: ObjectId,
    quizId: ObjectId,
    quizData: IQuiz,
    questions: IQuizDetails["questions"]
  ): Promise<void> {
    return withTransaction(async (session) => {
      const editFilter: EditQuizFilters = {};

      if (Object.keys(quizData).length === 0 && questions.length === 0)
        throw new Error("You need to change at least 1 parameter or question.");

      editFilter.updatedAt = new Date();
      if (quizData.title) editFilter.title = quizData.title;
      if (quizData.description) editFilter.description = quizData.description;
      if (quizData.time) editFilter.time = Number(quizData.time);
      if (quizData.difficulty) editFilter.difficulty = quizData.difficulty;
      if (quizData.category) editFilter.category = quizData.category;
      if (quizData.points) throw new Error("You can`t set points manually.");

      await ValidationService.validateUser(userId, { session });
      const quizBeforeEdit = await ValidationService.validateQuiz(quizId, {
        session,
      });
      const quizDetaileBeforeEdit = await ValidationService.validateQuizDetails(
        quizBeforeEdit.quizDetails,
        { session }
      );
      await ValidationService.isAuthorized(
        userId,
        quizBeforeEdit.createdBy,
        "You can edit only your own Quizzes.",
        { session }
      );
      const pointsParameters = {
        time: quizData.time || quizBeforeEdit.time,
        difficulty: quizData.difficulty || quizBeforeEdit.difficulty,
        questionsLength:
          questions.length || quizDetaileBeforeEdit.questions.length,
      };

      editFilter.points = calculatePoints(
        pointsParameters.time,
        pointsParameters.difficulty,
        pointsParameters.questionsLength
      );

      const newQuiz = await QuizRepository.editQuiz(quizId, editFilter, {
        session,
      });

      let quizDetails;

      if (questions.length !== 0)
        quizDetails = await QuizDetailsRepository.editQuizDetails(
          quizBeforeEdit.quizDetails,
          questions,
          { session }
        );

      return { newQuiz, quizDetails, message: "Quiz edited succesfully." };
    });
  }

  async deleteQuiz(userId: ObjectId, quizId: ObjectId): Promise<string> {
    return withTransaction(async (session) => {
      await ValidationService.validateUser(userId, { session });
      const quiz = await ValidationService.validateQuiz(quizId, { session });
      await ValidationService.validateQuizDetails(quiz.quizDetails, {
        session,
      });

      await ValidationService.isAuthorized(
        userId,
        quiz.createdBy,
        "You can delete only your own Quiz."
      );

      const quizDeleted = await QuizRepository.deleteQuiz(quizId, { session });
      if (!quizDeleted) throw new Error("Failed to delete the quiz.");

      const detailsDeleted = await QuizDetailsRepository.deleteQuizDetails(
        quiz.quizDetails,
        { session }
      );
      if (!detailsDeleted) throw new Error("Failed to delete quiz details.");

      await CommentRepository.deleteQuizComments(quizId, { session });

      await RatingRepository.deleteQuizRatings(quizId, { session });
      await userRepository.addOrSubstractCreatedQuizzes(userId, -1, {
        session,
      });

      return "Your Quiz has been successfully deleted.";
    });
  }

  async getQuizzes(
    filters: QuizFilters,
    page: number,
    limit: number,
    sortBy: string,
    order: number
  ) {
    const aggregationPipeline: any[] = [];
    const matchStage: any = {};
    if (filters.userId)
      matchStage.createdBy = new mongoose.Types.ObjectId(filters.userId);
    if (filters.category) matchStage.category = filters.category;
    if (filters.title) {
      matchStage.title = { $regex: filters.title, $options: "i" };
    }
    if (filters.difficulty) matchStage.difficulty = filters.difficulty;

    if (filters.recently) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      matchStage.updatedAt = { $gte: oneWeekAgo };
    }
    if (filters.status) matchStage.status = filters.status;

    aggregationPipeline.push(
      {
        $lookup: {
          from: "quizdetails",
          localField: "quizDetails",
          foreignField: "_id",
          as: "details",
        },
      },
      {
        $addFields: {
          questions: {
            $cond: {
              if: { $gt: [{ $size: "$details" }, 0] },
              then: { $size: { $arrayElemAt: ["$details.questions", 0] } },
              else: 0,
            },
          },
        },
      }
    );

    aggregationPipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $addFields: {
          user: {
            nickname: { $arrayElemAt: ["$userDetails.nickname", 0] },
            profilePicture: {
              $arrayElemAt: ["$userDetails.profilePicture", 0],
            },
          },
        },
      },
      { $unset: "userDetails" }
    );

    if (filters.questionsCount !== undefined) {
      aggregationPipeline.push(
        {
          $unwind: "$details",
        },
        {
          $match: {
            "details.questions": { $size: filters.questionsCount },
          },
        }
      );
    } else {
      aggregationPipeline.push({ $unset: "details" });
    }

    if (filters.liked === true) {
      aggregationPipeline.push(
        {
          $lookup: {
            from: "ratings",
            localField: "_id",
            foreignField: "quizId",
            as: "ratings",
          },
        },
        {
          $unwind: "$ratings",
        },
        {
          $match: {
            "ratings.rating": 1,
          },
        },
        {
          $project: {
            ratings: 0,
          },
        }
      );
    }

    if (Object.keys(matchStage).length > 0) {
      aggregationPipeline.push({ $match: matchStage });
    }

    const skip = (page - 1) * limit;
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: limit });
    aggregationPipeline.push({ $unset: "details" });
    aggregationPipeline.push({ $sort: { [sortBy]: order } });

    const quizzes = await quizRepository.executeAggregation(
      aggregationPipeline
    );

    if (filters.shuffle) shuffleQuizzes(quizzes);

    return { quizzes, message: `${quizzes.length} has been found.` };
  }

  async getQuizWithDetails(quizId: ObjectId): Promise<IQuiz> {
    const quiz = await ValidationService.validateQuiz(quizId);
    await ValidationService.validateQuizDetails(quiz.quizDetails);
    return await quizRepository.getQuizWithDetails(quizId);
  }

  async changeQuizStatus(
    userId: ObjectId,
    quizId: ObjectId,
    status: string
  ): Promise<string> {
    await ValidationService.validateUser(userId);
    const quiz = await ValidationService.validateQuiz(quizId);
    await ValidationService.isAuthorized(
      userId,
      quiz.createdBy,
      "You can change status only in your Quizzes."
    );
    if (quiz.status === status)
      throw new Error("You can`t change status to the same value.");
    await QuizRepository.changeQuizStatus(quizId, status);

    return "Status has been succesfully changed.";
  }
}

module.exports = new QuizService();
