import mongoose from "mongoose";
import { IQuiz } from "../models/quiz.model";

const User = require("../models/user.model");
const Quiz = require("../models/quiz.model");

const calculatePoints = (time: number, difficulty: string, length: number) => {
  const difficultyModifier =
    difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  return Math.round((difficultyModifier * (4 + 10 / time) * length) / 3);
};

class QuizService {
  async createQuiz(
    userId: mongoose.ObjectId,
    title: string,
    time: number,
    questions: IQuiz["questions"],
    difficulty: string,
    createdBy: IQuiz["createdBy"]
  ): Promise<IQuiz> {
    if (title.length < 5 || title.length > 30) {
      throw new Error("Quiz title must be between 5 and 30 characters long.");
    }

    if (time < 1 || time > 10) {
      throw new Error("Quiz time must be between 1 and 10 minutes.");
    }
    if (questions.length < 3 || questions.length > 15) {
      throw new Error("Quiz must have between 3 and 15 questions.");
    }

    // throw new Error(title + " " + time);

    const quiz = await Quiz.create({
      title,
      time,
      questions,
      points: calculatePoints(time, difficulty, questions.length),
      difficulty,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      // status?: 'draft' | 'published' | 'archived';
    });

    await User.findByIdAndUpdate(userId, {
      $push: { createdQuizzes: quiz._id },
      new: true,
    });

    if (!quiz) throw new Error("Invalid quiz data");

    return {
      ...quiz,
    };
  }

  async editQuiz() {}

  async deleteQuiz(userId: mongoose.ObjectId, quizId: mongoose.ObjectId) {
    await Quiz.findOneAndDelete({ _id: quizId });
    const user = await User.findByIdAndUpdate(userId, {
      $pull: { createdQuizzes: quizId },
      new: true,
    });

    return { ...user };
  }
}

module.exports = new QuizService();
