import { Request, Response } from "express";
import commentService from "../services/comment.service";

export const getComments = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.query;
    const comments = await commentService.getComments(quizId as string);
    res.status(200).json(comments);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
