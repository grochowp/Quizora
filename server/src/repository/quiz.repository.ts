import { ObjectId } from "mongoose";
import { IQuiz } from "../models/quiz.model";

const Quiz = require("../models/quiz.model");

class QuizRepository {
  async create(quizData: any): Promise<IQuiz> {
    return await Quiz.create(quizData);
  }

  async executeAggregation(pipeline: any[]): Promise<IQuiz[]> {
    return await Quiz.aggregate(pipeline);
  }

  async findQuizById(quizId: ObjectId): Promise<IQuiz> {
    return await Quiz.findById(quizId);
  }
}

export default new QuizRepository();

// async getQuizzesByUserId(userId: string): Promise<IQuiz[]> {
//   return await Quiz.find({ createdBy: userId });
// }

// async getQuizzesByCategory(category: string): Promise<IQuiz[]> {
//   return await Quiz.find({ category });
// }

// async getQuizzesByTitle(title: string): Promise<IQuiz[]> {
//   return await Quiz.find({ title });
// }

// async getQuizzesByDifficulty(difficulty: string): Promise<IQuiz[]> {
//   return await Quiz.find({ difficulty });
// }

// async getQuizzesByNumberOfQuestions(
//   questionNumber: number
// ): Promise<IQuiz[]> {
//   return await Quiz.aggregate([
//     {
//       $lookup: {
//         from: "quizdetails",
//         localField: "_id",
//         foreignField: "quizId",
//         as: "details",
//       },
//     },
//     {
//       $match: {
//         "details.questions": { $size: questionNumber },
//       },
//     },
//     {
//       $unwind: "$details",
//     },
//     {
//       $unset: "details",
//     },
//   ]);
// }

// async getAllQuizzes(): Promise<IQuiz[]> {
//   return await Quiz.find();
// }
