import { Request, Response } from "express";
import { IQuiz } from "../models/quiz.model";
import mongoose from "mongoose";

const QuizService = require("../services/quiz.service");

interface IQuizRequest extends Request {
  body: IQuiz & { userId: mongoose.ObjectId };
}

const createQuiz = async (req: IQuizRequest, res: Response) => {
  const { userId, title, time, questions, difficulty, createdBy } = req.body;

  try {
    const quiz = await QuizService.createQuiz(
      userId,
      title,
      time,
      questions,
      difficulty,
      createdBy
    );
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteQuiz = async (req: IQuizRequest, res: Response) => {
  const { userId, quizId } = req.query;

  try {
    const quiz = await QuizService.deleteQuiz(userId, quizId);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  deleteQuiz,
};
