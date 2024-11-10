import { ClientSession, ObjectId } from "mongoose";
import { IQuiz } from "../models/quiz.model";
import { IRating } from "../models/rating.model";

const Quiz = require("../models/quiz.model");
const QuizDetails = require("../models/quizDetails.model");
class QuizRepository {
  async create(
    quizData: any,
    options: { session: ClientSession }
  ): Promise<IQuiz> {
    const createdQuiz = await Quiz.create([quizData], options);
    return createdQuiz[0];
  }

  async deleteQuiz(
    quizId: ObjectId,
    options: { session: ClientSession }
  ): Promise<boolean> {
    const result = await Quiz.deleteOne({ _id: quizId }, options);
    return result.deletedCount > 0;
  }

  async executeAggregation(pipeline: any[]): Promise<IQuiz[]> {
    return await Quiz.aggregate(pipeline);
  }

  async findQuizById(
    quizId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IQuiz> {
    return await Quiz.findById(quizId).session(options?.session);
  }

  async addRating(
    quizId: ObjectId,
    rating: number,
    options: { session: ClientSession }
  ) {
    await Quiz.findOneAndUpdate({ _id: quizId }, { $inc: { rating } }, options);
  }

  async editRating(
    quizId: ObjectId,
    newRating: number,
    options: { session: ClientSession }
  ) {
    await Quiz.findOneAndUpdate(
      { _id: quizId },
      { $inc: { rating: newRating * 2 } },
      options
    );
  }

  async deleteRating(
    quizId: ObjectId,
    rating: number,
    options: { session: ClientSession }
  ): Promise<IRating> {
    return await Quiz.findOneAndUpdate(
      { _id: quizId },
      { $inc: { rating: -rating } },
      options
    );
  }

  async changeQuizStatus(quizId: ObjectId, status: string) {
    await Quiz.findOneAndUpdate(
      { _id: quizId },
      {
        $set: { status },
      }
    );
  }
}

export default new QuizRepository();
