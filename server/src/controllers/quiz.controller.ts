import { Request, Response } from "express";
import { QuizFilters, UserTokenRequest } from "../types/interfaces";
import { IQuiz } from "../models/quiz.model";

const QuizService = require("../services/quiz.service");

const createQuiz = async (req: Request & UserTokenRequest, res: Response) => {
  const { _id: userId } = req.user;
  const { title, description, time, questions, difficulty, category } =
    req.body;
  try {
    const { quiz, createdQuizzesMessage } = await QuizService.createQuiz(
      userId,
      title,
      description,
      time,
      questions,
      difficulty,
      category
    );
    res.status(201).json({ quiz, createdQuizzesMessage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editQuiz = async (req: Request & UserTokenRequest, res: Response) => {
  const { _id: userId } = req.user;
  const { quizId } = req.params;
  const { quiz, questions } = req.body;

  try {
    const { newQuiz, quizDetails, message } = await QuizService.editQuiz(
      userId,
      quizId,
      quiz,
      questions
    );
    res.status(200).json({ quiz: newQuiz, quizDetails, message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteQuiz = async (req: Request & UserTokenRequest, res: Response) => {
  const { _id: userId } = req.user;
  const { quizId } = req.params;

  try {
    const message = await QuizService.deleteQuiz(userId, quizId);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const fetchQuizzes = async (req: Request, res: Response) => {
  const filters: QuizFilters = {};
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const sortBy = req.query.sortBy || "noSort";
  const order = Number(req.query.order) || -1;

  if (req.query.userId) filters.userId = req.query.userId as string;
  if (req.query.difficulty) filters.difficulty = req.query.difficulty as string;
  if (req.query.category) filters.category = req.query.category as string;
  if (req.query.title) filters.title = req.query.title as string;
  if (req.query.status) filters.status = req.query.status as string;
  if (req.query.recently) filters.recently = req.query.recently === "true";
  if (req.query.liked) filters.liked = req.query.liked === "true";
  if (req.query.questionsCount)
    filters.questionsCount = +req.query.questionsCount;

  try {
    const { quizzes, createdQuizzesMessage } = await QuizService.getQuizzes(
      filters,
      page,
      limit,
      sortBy,
      order
    );
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getQuizDetails = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  try {
    const quizWithDetails = await QuizService.getQuizDetails(quizId);
    res.status(200).json(quizWithDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const changeQuizStatus = async (
  req: Request & UserTokenRequest,
  res: Response
) => {
  const { _id: userId } = req.user;
  const { quizId } = req.params;
  const { status } = req.query;
  try {
    const message = await QuizService.changeQuizStatus(userId, quizId, status);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  editQuiz,
  deleteQuiz,
  fetchQuizzes,
  getQuizDetails,
  changeQuizStatus,
};
