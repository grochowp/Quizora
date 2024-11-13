import { ClientSession, ObjectId } from "mongoose";
import { IQuestion, IQuizDetails } from "../models/quizDetails.model";

const QuizDetails = require("../models/quizDetails.model");

class QuizDetailsRepository {
  async create(
    questions: IQuestion[],
    options: { session: ClientSession }
  ): Promise<IQuizDetails> {
    return await QuizDetails.create([{ questions }], options);
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
    ); // return only QuizDetails
    //return await QuizDetails.find({ _id: quizDetailsId }).populate("quiz").lean(); // return Quiz with its details
  }
  async deleteQuizDetailsFromMultipleQuizzes(
    quizIds: ObjectId[],
    options: { session: ClientSession }
  ) {
    await QuizDetails.deleteMany({ quiz: { $in: quizIds } }, options);
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
