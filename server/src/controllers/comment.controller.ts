import { Request, Response } from "express";
import { CommentFilters, UserTokenRequest } from "../types/interfaces";

const CommentService = require("../services/comment.service");

const addComment = async (req: Request & UserTokenRequest, res: Response) => {
  try {
    const { _id: userId } = req.user;
    const { quizId, comment } = req.body;
    const newComment = await CommentService.addComment(userId, quizId, comment);
    res.status(200).json({ message: newComment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteComment = async (
  req: Request & UserTokenRequest,
  res: Response
) => {
  try {
    const { commentId } = req.params;
    const { _id: userId } = req.user;
    await CommentService.deleteComment(userId, commentId);
    res.status(200).json({ message: "Comment has been succesfully deleted." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getComments = async (req: Request, res: Response) => {
  const filters: CommentFilters = {};
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 4;
  const sortBy = req.query.sortBy || "new";

  if (req.query.userId) filters.userId = req.query.userId as string;
  if (req.query.quizId) filters.quizId = req.query.quizId as string;

  try {
    const comments = await CommentService.getComments(
      filters,
      page,
      limit,
      sortBy
    );
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addComment, deleteComment, getComments };