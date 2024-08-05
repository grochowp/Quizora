import { Request, Response } from "express";
import { IQuiz } from "../models/quiz.model";

const QuizService = require("../services/quiz.service");

interface IQuizRequest extends Request {
  body: IQuiz;
}

const createQuiz = async (req: IQuizRequest, res: Response) => {
  const { title, time, questions, difficulty, createdBy } = req.body;

  try {
    const quiz = await QuizService.createQuiz(
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

module.exports = {
  createQuiz,
};
