import { ClientSession, ObjectId } from "mongoose";
import { IQuestion, IQuizDetails } from "../models/quizDetails.model";

const QuizDetails = require("../models/quizDetails.model");

class QuizDetailsRepository {
  async create(
    questions: IQuestion[],
    options: { session: ClientSession }
  ): Promise<IQuizDetails> {
    const quizDetails = await QuizDetails.create([{ questions }], options);
    return quizDetails[0];
  }

  async deleteQuizDetails(
    quizDetailsId: ObjectId,
    options: { session: ClientSession }
  ): Promise<boolean> {
    const result = await QuizDetails.deleteOne({ _id: quizDetailsId }, options);
    return result.deletedCount > 0;
  }

  async getQuizDetails(
    quizDetailsId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IQuizDetails> {
    return await QuizDetails.findOne({ _id: quizDetailsId }).session(
      options?.session
    );
  }
  async deleteQuizDetailsFromMultipleQuizzes(
    quizIds: ObjectId[],
    options: { session: ClientSession }
  ) {
    await QuizDetails.deleteMany({ _id: { $in: quizIds } }, options);
  }

  async editQuizDetails(
    quizDetailsId: ObjectId,
    questions: IQuizDetails["questions"],
    options: { session: ClientSession }
  ): Promise<IQuizDetails> {
    return await QuizDetails.findOneAndUpdate(
      { _id: quizDetailsId },
      { $set: { questions } },
      { new: true, session: options.session, runValidators: true }
    );
  }
}

export default new QuizDetailsRepository();
