import { ObjectId } from "mongoose";
import { IComment } from "../models/comment.model";
import CommentRepository from "../repository/comment.repository";

class CommentService {
  async getComments(quizId: ObjectId): Promise<IComment[]> {
    const comments = await CommentRepository.getByQuizId(quizId);
    return comments;
  }
}

module.exports = new CommentService();
