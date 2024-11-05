import mongoose from "mongoose";
import { IQuiz } from "../models/quiz.model";

const User = require("../models/user.model");
const Quiz = require("../models/quiz.model");
const QuizDetails = require("../models/quizDetails.model");

const calculatePoints = (time: number, difficulty: string, length: number) => {
  const difficultyModifier =
    difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  return Math.round((difficultyModifier * (4 + 10 / time) * length) / 3);
};

class QuizService {
  async createQuiz(): Promise<null> {
    // if (title.length < 5 || title.length > 30) {
    //   throw new Error("Quiz title must be between 5 and 30 characters long.");
    // }
    // if (time < 1 || time > 10) {
    //   throw new Error("Quiz time must be between 1 and 10 minutes.");
    // }
    // if (questions.length < 3 || questions.length > 15) {
    //   throw new Error("Quiz must have between 3 and 15 questions.");
    // }
    // const quiz = await Quiz.create({
    //   title,
    //   time,
    //   questions,
    //   points: calculatePoints(time, difficulty, questions.length),
    //   difficulty,
    //   createdBy,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   // status?: 'draft' | 'published' | 'archived';
    // });
    // if (!quiz) throw new Error("Invalid quiz data.");
    // const user = await User.findByIdAndUpdate(userId, {
    //   $push: { createdQuizzes: quiz._id },
    //   new: true,
    // });
    // if (!user) throw new Error("Invalid user data.");
    // return user;
    return null;
  }

  async editQuiz(): Promise<void> {}

  async deleteQuiz(): Promise<void> {}

  async getQuizzesByUserId(): Promise<void> {}
}

module.exports = new QuizService();
