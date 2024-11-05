import mongoose from "mongoose";
import { IComment } from "../models/comment.model";

const Comment = require("../models/comments.model");

class CommentService {
  async getComments(quizId: string): Promise<IComment[]> {
    const comments = await Comment.find({ quizId });
    return comments;
  }
}

export default new CommentService();
