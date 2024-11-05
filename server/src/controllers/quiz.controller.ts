import { Request, Response } from "express";
import { IQuiz } from "../models/quiz.model";
import mongoose from "mongoose";
import { IUser } from "../models/user.model";
import QuizService from "../services/quiz.service";

interface IQuizRequest extends Request {
  body: IQuiz;
  user: IUser;
}

export const createQuiz = async (req: IQuizRequest, res: Response) => {
  // const { _id: userId, nickname } = req.user;
  // const { title, time, questions, difficulty } = req.body;
  // const createdBy = { userId, nickname };
  try {
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteQuiz = async (req: IQuizRequest, res: Response) => {
  const { _id: userId } = req.user;
  const { quizId } = req.query;

  try {
    const quiz = await QuizService.deleteQuiz();
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getQuizzesByUserId = async (req: IQuizRequest, res: Response) => {
  const { userId } = req.query;

  try {
    const quizzes = await QuizService.getQuizzesByUserId();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
