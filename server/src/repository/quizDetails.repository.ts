import { ObjectId } from "mongoose";
import { IQuestion, IQuizDetails } from "../models/quizDetails.model";

const QuizDetails = require("../models/quizDetails.model");

class QuizDetailsRepository {
  async create(
    quizId: ObjectId,
    questions: IQuestion[]
  ): Promise<IQuizDetails> {
    return await QuizDetails.create({ quizId, questions });
  }
}

export default new QuizDetailsRepository();
