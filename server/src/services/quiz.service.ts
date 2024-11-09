import mongoose, { ObjectId } from "mongoose";
import { IQuiz } from "../models/quiz.model";
import { IQuestion, IQuizDetails } from "../models/quizDetails.model";
import QuizRepository from "../repository/quiz.repository";
import QuizDetailsRepository from "../repository/quizDetails.repository";
import { QuizFilters } from "../types/interfaces";
import quizRepository from "../repository/quiz.repository";
import quizDetailsRepository from "../repository/quizDetails.repository";

const ValidationService = require("./validation.service");

const calculatePoints = (time: number, difficulty: string, length: number) => {
  const difficultyModifier =
    difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  let points = Math.round((difficultyModifier * (4 + 10 / time) * length) / 3);
  points = Math.max(5, Math.min(points, 90));

  return points;
};

const sortQuizzes = (quizzes: IQuiz[], sortBy: string): IQuiz[] => {
  const sortMap: Record<IQuiz["difficulty"], number> = {
    easy: 0,
    medium: 1,
    hard: 2,
  };

  const sortFunctions: Record<string, (a: IQuiz, b: IQuiz) => number> = {
    new: (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    old: (a, b) =>
      new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    pointsAsc: (a, b) => a.points - b.points,
    pointsDesc: (a, b) => b.points - a.points,
    difficultyAsc: (a, b) => sortMap[a.difficulty] - sortMap[b.difficulty],
    difficultyDesc: (a, b) => sortMap[b.difficulty] - sortMap[a.difficulty],
  };

  return sortFunctions[sortBy]
    ? [...quizzes].sort(sortFunctions[sortBy])
    : quizzes;
};

class QuizService {
  async createQuiz(
    userId: ObjectId,
    title: string,
    time: number,
    questions: IQuestion[],
    difficulty: string,
    category: string
  ): Promise<IQuiz> {
    if (title.length < 5 || title.length > 50) {
      throw new Error("Quiz title must be between 5 and 50 characters long.");
    }
    if (time < 3 || time > 10) {
      throw new Error("Quiz time must be between 3 and 10 minutes.");
    }
    if (questions.length < 3 || questions.length > 15) {
      throw new Error("Quiz must have between 3 and 15 questions.");
    }
    const quizData = {
      title,
      time,
      points: calculatePoints(time, difficulty, questions.length),
      difficulty,
      category,
      createdBy: userId,
    };

    const quiz = await QuizRepository.create(quizData);
    const quizDetails = await QuizDetailsRepository.create(quiz._id, questions);

    if (!quiz || !quizDetails) throw new Error("Invalid quiz data.");

    return quiz;
  }

  async editQuiz(): Promise<void> {}

  async deleteQuiz(userId: ObjectId, quizId: ObjectId): Promise<string> {
    console.log(userId, quizId);
    await ValidationService.validateUser(userId);
    await ValidationService.validateQuiz(quizId);
    const quiz = await QuizRepository.findQuizById(quizId);
    ValidationService.isAuthorized(
      userId,
      quiz.createdBy,
      "You can delete only your own Quiz."
    );

    return "Your Quiz has been successfully deleted.";
  }

  async getQuizzes(
    filters: QuizFilters,
    page: number,
    limit: number,
    sortBy: string
  ): Promise<IQuiz[]> {
    const aggregationPipeline: any[] = [];
    const matchStage: any = {};
    let quizzes = [];
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
          localField: "_id",
          foreignField: "quiz",
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

    if (filters.questionsCount !== undefined) {
      aggregationPipeline.push(
        {
          $match: {
            "details.questions": { $size: filters.questionsCount },
          },
        },
        {
          $unwind: "$details",
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
          $match: {
            "ratings.rating": 1,
          },
        },
        {
          $unwind: "$ratings",
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
    console.log(aggregationPipeline);

    quizzes = await quizRepository.executeAggregation(aggregationPipeline);

    return sortQuizzes(quizzes, sortBy);
  }

  async getQuizDetails(quizId: ObjectId): Promise<IQuizDetails> {
    await ValidationService.validateQuiz(quizId);
    console.log(quizId);
    const quiz = await quizDetailsRepository.getQuizDetails(quizId);
    return quiz;
  }
}

module.exports = new QuizService();
