import { ObjectId } from "mongoose";
import { IQuiz } from "../models/quiz.model";

const Quiz = require("../models/quiz.model");
const QuizDetails = require("../models/quizDetails.model");
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

  async addRating(quizId: ObjectId, rating: number) {
    await Quiz.findOneAndUpdate({ _id: quizId }, { $inc: { rating } });
  }
  async editRating(quizId: ObjectId, newRating: number) {
    await Quiz.findOneAndUpdate(
      { _id: quizId },
      { $inc: { rating: newRating * 2 } }
    );
  }
  async deleteRating(quizId: ObjectId, rating: number) {
    await Quiz.findOneAndUpdate({ _id: quizId }, { $inc: { rating: -rating } });
  }
}

export default new QuizRepository();
