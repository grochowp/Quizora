import mongoose from "mongoose";
import { IComment } from "../models/comment.model";

const Comment = require("../models/comment.model");

class CommentService {
  async getComments(quizId: mongoose.Types.ObjectId): Promise<IComment[]> {
    const comments = await Comment.find({ quizId });
    return comments;
  }
}

module.exports = new CommentService();
