import { ClientSession, ObjectId } from "mongoose";
import { IQuiz } from "../models/quiz.model";
import { IRating } from "../models/rating.model";
import { EditQuizFilters } from "../types/interfaces";

const Quiz = require("../models/quiz.model");
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

  async addOrSubstractRating(
    quizId: ObjectId,
    rating: number,
    options: { session: ClientSession }
  ): Promise<IRating> {
    return await Quiz.findOneAndUpdate(
      { _id: quizId },
      { $inc: { rating } },
      options
    );
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

  async changeQuizStatus(quizId: ObjectId, status: string) {
    await Quiz.findOneAndUpdate(
      { _id: quizId },
      {
        $set: { status },
      },
      { runValidators: true }
    );
  }

  async findUserQuizzesIds(
    userId: ObjectId,
    options: { session: ClientSession }
  ) {
    return await Quiz.find({ createdBy: userId }, null, options).select(
      "_id quizDetails"
    );
  }

  async deleteUserQuizzes(
    quizIds: ObjectId[],
    options: { session: ClientSession }
  ) {
    await Quiz.deleteMany({ _id: { $in: quizIds } }, options);
  }

  async editQuiz(
    quizId: ObjectId,
    quiz: EditQuizFilters,
    options: { session: ClientSession }
  ): Promise<IQuiz> {
    return await Quiz.findByIdAndUpdate(
      quizId,
      { $set: quiz },
      { new: true, session: options.session, runValidators: true }
    );
  }

  async getQuizWithDetails(quizId: ObjectId): Promise<IQuiz> {
    return Quiz.findById(quizId).populate("quizDetails");
  }

  async findQuizzesLength(pipeline: any): Promise<number> {
    const quizzes = await Quiz.aggregate(pipeline);
    return quizzes.length;
  }
}

export default new QuizRepository();
