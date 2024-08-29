import { Request, Response } from "express";
import { IQuiz } from "../models/quiz.model";
import mongoose from "mongoose";
import { IUser } from "../models/user.model";

const QuizService = require("../services/quiz.service");

interface IQuizRequest extends Request {
  body: IQuiz;
  user: IUser;
}

const createQuiz = async (req: IQuizRequest, res: Response) => {
  const { _id: userId, nickname } = req.user;
  const { title, time, questions, difficulty } = req.body;
  const createdBy = { userId, nickname };
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
  const { _id: userId } = req.user;
  const { quizId } = req.query;

  try {
    const quiz = await QuizService.deleteQuiz(userId, quizId);
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getQuizzesByUserId = async (req: IQuizRequest, res: Response) => {
  const { userId } = req.query;

  try {
    const quizzes = await QuizService.getQuizzesByUserId(userId);
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  deleteQuiz,
  getQuizzesByUserId,
};
