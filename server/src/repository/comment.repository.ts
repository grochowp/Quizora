import { ObjectId } from "mongoose";
import { IComment } from "../models/comment.model";

const Comment = require("../models/comment.model");

class CommentRepository {
  async addComment(
    userId: ObjectId,
    quizId: ObjectId,
    comment: string,
    rating: number
  ): Promise<IComment> {
    return await Comment.create({
      userId,
      quizId,
      comment,
      rating,
      data: new Date(),
    });
  }

  async deleteComment(commentId: ObjectId) {
    await Comment.findOneAndDelete(commentId); // TO-DO --- verify if findOneByIdAndDelete is a correct method
  }

  async getComments(pipeline: any[]): Promise<IComment[]> {
    return await Comment.aggregate(pipeline);
  }

  async checkExistence(userId: ObjectId, quizId: ObjectId): Promise<IComment> {
    return await Comment.findOne({ userId, quizId });
  }
}

export default new CommentRepository();
