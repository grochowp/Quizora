import { ObjectId } from "mongoose";
import { IQuiz } from "../models/quiz.model";
import { IQuestion } from "../models/quizDetails.model";
import QuizRepository from "../repository/quiz.repository";
import QuizDetailsRepository from "../repository/quizDetails.repository";

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

  async getQuizzesByUserId(): Promise<void> {}
}

module.exports = new QuizService();
