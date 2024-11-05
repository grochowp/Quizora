import { ObjectId } from "mongoose";
import { IComment } from "../models/comment.model";

const Comment = require("../models/comment.model");

class CommentRepository {
  async getByQuizId(quizId: ObjectId): Promise<IComment[]> {
    return await Comment.find({ quizId });
  }
}

export default new CommentRepository();
