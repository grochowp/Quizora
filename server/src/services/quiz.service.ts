import { ObjectId } from "mongoose";
import { IQuiz } from "../models/quiz.model";
import { IQuestion } from "../models/quizDetails.model";
import QuizRepository from "../repository/quiz.repository";
import QuizDetailsRepository from "../repository/quizDetails.repository";
import { QuizFilters } from "../types/interfaces";
import quizRepository from "../repository/quiz.repository";

const calculatePoints = (time: number, difficulty: string, length: number) => {
  const difficultyModifier =
    difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  return Math.round((difficultyModifier * (4 + 10 / time) * length) / 3);
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
    if (title.length < 5 || title.length > 30) {
      throw new Error("Quiz title must be between 5 and 30 characters long.");
    }
    if (time < 3 || time > 10) {
      throw new Error("Quiz time must be between 1 and 10 minutes.");
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

  async deleteQuiz(): Promise<void> {}

  // async getQuizzes(filters: QuizFilters): Promise<IQuiz[]> {
  //   if (filters.userId) {
  //     return await quizRepository.getQuizzesByUserId(filters.userId);
  //   }

  //   if (filters.category) {
  //     return await quizRepository.getQuizzesByCategory(filters.category);
  //   }

  //   if (filters.difficulty) {
  //     return await quizRepository.getQuizzesByDifficulty(filters.difficulty);
  //   }
  //   if (filters.title) {
  //     return await quizRepository.getQuizzesByTitle(filters.title);
  //   }

  //   if (filters.questionsCount) {
  //     return await quizRepository.getQuizzesByNumberOfQuestions(
  //       filters.questionsCount
  //     );
  //   }

  //   return await quizRepository.getAllQuizzes();
  // }

  async getQuizzes(
    filters: QuizFilters,
    page: number,
    limit: number
  ): Promise<IQuiz[]> {
    const aggregationPipeline: any[] = [];
    const matchStage: any = {};
    if (filters.userId) matchStage.createdBy = filters.userId;
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

    if (filters.questionsCount !== undefined) {
      aggregationPipeline.push(
        {
          $lookup: {
            from: "quizdetails",
            localField: "_id",
            foreignField: "quizId",
            as: "details",
          },
        },
        {
          $match: {
            "details.questions": { $size: filters.questionsCount },
          },
        },
        {
          $unwind: "$details",
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

    return await quizRepository.executeAggregation(aggregationPipeline);
  }
}

module.exports = new QuizService();
