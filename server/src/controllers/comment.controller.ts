import { Request, Response } from "express";

const CommentService = require("../services/comment.service");

const getComments = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.query;
    const comments = await CommentService.getComments(quizId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { getComments };
