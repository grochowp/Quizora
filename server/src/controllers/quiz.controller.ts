import { Request, Response } from "express";
import { IQuiz } from "../models/quiz.model";
import mongoose, { ObjectId } from "mongoose";
import { IUser } from "../models/user.model";
import { IQuizDetails } from "../models/quizDetails.model";
import { QuizFilters } from "../types/interfaces";

const QuizService = require("../services/quiz.service");

interface IQuizRequest extends Request {
  body: IQuiz & IQuizDetails;
  user: IUser;
}

const createQuiz = async (req: IQuizRequest, res: Response) => {
  const { _id: userId } = req.user;
  const { title, time, questions, difficulty, category } = req.body;
  try {
    const quiz = await QuizService.createQuiz(
      userId,
      title,
      time,
      questions,
      difficulty,
      category
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

const fetchQuizzes = async (req: IQuizRequest, res: Response) => {
  const filters: QuizFilters = {};
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  // TO-DO Add sorting by Quiz points, update date, difficulty, all in both ways

  if (req.query.userId) {
    filters.userId = req.query.userId as string;
  }

  if (req.query.difficulty) {
    filters.difficulty = req.query.difficulty as string;
  }

  if (req.query.category) {
    filters.category = req.query.category as string;
  }

  if (req.query.title) {
    filters.title = req.query.title as string;
  }

  if (req.query.questionsCount) {
    filters.questionsCount = +req.query.questionsCount;
  }

  if (req.query.recently) {
    filters.recently = req.query.recently === "true";
  }

  try {
    const quizzes = await QuizService.getQuizzes(filters, page, limit);
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  deleteQuiz,
  fetchQuizzes,
};
