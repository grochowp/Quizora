import mongoose, { ClientSession, ObjectId } from "mongoose";
import { IComment } from "../models/comment.model";
import CommentRepository from "../repository/comment.repository";
import { CommentFilters } from "../types/interfaces";
import RatingRepository from "../repository/rating.repository";
import { withTransaction } from "../utils/transaction";

const ValidationService = require("./validation.service");

class CommentService {
  async addComment(
    userId: ObjectId,
    quizId: ObjectId,
    comment: string
  ): Promise<string> {
    return withTransaction(async (session) => {
      if (comment.length < 5)
        throw new Error(
          "Your comment is too short. It must be at least 5 characters"
        );
      if (comment.length > 60)
        throw new Error(
          "Your comment is too long. It must be maximum of 60 characters"
        );

      await ValidationService.validateUser(userId, { session });
      await ValidationService.validateQuiz(quizId, { session });

      const existingComment =
        await CommentRepository.checkIfCommentAlreadyExist(userId, quizId, {
          session,
        });

      if (existingComment) throw new Error("You already commented this Quiz.");

      const rating =
        (await RatingRepository.findRatingByData(userId, quizId, { session }))
          ?.rating || 0;

      await CommentRepository.addComment(userId, quizId, comment, rating, {
        session,
      });
      return "Your comment has been successfully added.";
    });
  }

  async deleteComment(userId: ObjectId, commentId: ObjectId) {
    const comment = await CommentRepository.findCommentById(commentId);
    ValidationService.isAuthorized(
      userId,
      comment.userId,
      "You can delete only your own comments."
    );
    await CommentRepository.deleteComment(commentId);
  }

  async getComments(
    filters: CommentFilters,
    page: number,
    limit: number,
    sortBy: string,
    order: string
  ): Promise<IComment[]> {
    const aggregationPipeline: any[] = [];
    const matchStage: any = {};
    if (filters.userId) {
      await ValidationService.validateUser(filters.userId);
      matchStage.userId = new mongoose.Types.ObjectId(filters.userId);
    }
    if (filters.quizId) {
      await ValidationService.validateQuiz(filters.quizId);
      matchStage.quizId = new mongoose.Types.ObjectId(filters.quizId);
    }

    if (!filters.quizId && !filters.userId)
      throw new Error(
        "You can only fetch comments associated with a user or a quiz."
      );

    if (Object.keys(matchStage).length > 0) {
      aggregationPipeline.push({ $match: matchStage });
    }

    const skip = (page - 1) * limit;
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: limit });
    aggregationPipeline.push({ $sort: { [sortBy]: order } });

    return await CommentRepository.getComments(aggregationPipeline);
  }

  async manageCommentRatingIfExist(
    userId: ObjectId,
    quizId: ObjectId,
    value: number,
    options?: { session: ClientSession }
  ): Promise<void> {
    const commentData = await CommentRepository.findCommentByData(
      userId,
      quizId,
      options
    );

    if (commentData) {
      const { _id: commentId } = commentData;
      await CommentRepository.editRating(commentId, value, options);
    }
  }
}

module.exports = new CommentService();
