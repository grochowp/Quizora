import { ClientSession, ObjectId } from "mongoose";
import { IComment } from "../models/comment.model";

const Comment = require("../models/comment.model");

class CommentRepository {
  async addComment(
    userId: ObjectId,
    quizId: ObjectId,
    comment: string,
    rating: number,
    options: { session: ClientSession }
  ) {
    await Comment.create(
      [
        {
          userId,
          quizId,
          comment,
          rating,
        },
      ],
      options
    );
  }

  async deleteComment(commentId: ObjectId) {
    await Comment.deleteOne({ _id: commentId });
  }

  async deleteUserComments(
    userId: ObjectId,
    options: { session: ClientSession }
  ) {
    await Comment.deleteMany({ userId }, options);
  }

  async findCommentById(commentId: ObjectId): Promise<IComment> {
    return await Comment.findOne({ _id: commentId });
  }

  async getComments(pipeline: any[]): Promise<IComment[]> {
    return await Comment.aggregate(pipeline);
  }

  async checkIfCommentAlreadyExist(
    userId: ObjectId,
    quizId: ObjectId,
    options: { session: ClientSession }
  ): Promise<IComment> {
    return await Comment.findOne({ userId, quizId }).session(options.session);
  }

  async findCommentByData(
    userId: ObjectId,
    quizId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IComment> {
    return await Comment.findOne({ userId, quizId }).session(options?.session);
  }

  async editRating(
    commentId: ObjectId,
    rating: number,
    options?: { session: ClientSession }
  ) {
    await Comment.findOneAndUpdate(
      { _id: commentId },
      { $set: { rating } }
    ).session(options?.session);
  }

  async deleteQuizComments(
    quizId: ObjectId,
    options: { session: ClientSession }
  ) {
    await Comment.deleteMany({ quizId }, options);
  }

  async deleteCommentsFromMultipleQuizzes(
    quizIds: ObjectId[],
    options: { session: ClientSession }
  ) {
    await Comment.deleteMany({ quizId: { $in: quizIds } }, options);
  }
}

export default new CommentRepository();
