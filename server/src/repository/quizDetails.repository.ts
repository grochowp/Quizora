import { ClientSession, ObjectId } from "mongoose";
import { IQuestion, IQuizDetails } from "../models/quizDetails.model";

const QuizDetails = require("../models/quizDetails.model");

class QuizDetailsRepository {
  async create(
    quizId: ObjectId,
    questions: IQuestion[],
    options: { session: ClientSession }
  ): Promise<IQuizDetails> {
    return await QuizDetails.create([{ quiz: quizId, questions }], options);
  }

  async deleteQuizDetails(
    quizId: ObjectId,
    options: { session: ClientSession }
  ): Promise<boolean> {
    const result = await QuizDetails.deleteOne({ quiz: quizId }, options);
    return result.deletedCount > 0;
  }

  async getQuizDetails(
    quizId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IQuizDetails> {
    return await QuizDetails.findOne({ quiz: quizId }).session(
      options?.session
    ); // return only QuizDetails
    //return await QuizDetails.find({ quiz: quizId }).populate("quiz").lean(); // return Quiz with its details
  }
}

export default new QuizDetailsRepository();
