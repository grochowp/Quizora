import { IQuiz } from "../models/quiz.model";

const Quiz = require("../models/quiz.model");

class QuizRepository {
  async create(quizData: any): Promise<IQuiz> {
    return await Quiz.create(quizData);
  }
}

export default new QuizRepository();
