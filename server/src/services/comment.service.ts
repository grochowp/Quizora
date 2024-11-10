import mongoose, { ClientSession, ObjectId } from "mongoose";
import { IComment } from "../models/comment.model";
import CommentRepository from "../repository/comment.repository";
import { CommentFilters } from "../types/interfaces";
import RatingRepository from "../repository/rating.repository";

const ValidationService = require("./validation.service");

const sortComments = (comments: IComment[], sortBy: string): IComment[] => {
  const sortFunction: Record<string, (a: IComment, b: IComment) => number> = {
    new: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    old: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    ratingAsc: (a, b) => a.rating - b.rating,
    ratingDesc: (a, b) => b.rating - a.rating,
  };
  return sortFunction[sortBy]
    ? [...comments].sort(sortFunction[sortBy])
    : comments;
};
class CommentService {
  async addComment(
    userId: ObjectId,
    quizId: ObjectId,
    comment: string
  ): Promise<string> {
    if (comment.length < 5)
      throw new Error(
        "Your comment is too short. It must be at least 5 characters"
      );
    if (comment.length > 60)
      throw new Error(
        "Your comment is too long. It must be maximum of 60 characters"
      );

    await ValidationService.validateUser(userId);
    await ValidationService.validateQuiz(quizId);

    const existingComment = await CommentRepository.checkIfCommentAlreadyExist(
      userId,
      quizId
    );

    if (existingComment) throw new Error("You already commented this Quiz.");

    const rating =
      (await RatingRepository.findRatingByData(userId, quizId))?.rating || 0;

    await CommentRepository.addComment(userId, quizId, comment, rating);
    return "Your comment has been successfully added.";
  }

  async deleteComment(userId: ObjectId, commentId: ObjectId) {
    const comment = await CommentRepository.findCommentById(commentId);

    if (userId.toString() !== comment.userId.toString())
      throw new Error("You can delete only your own comments.");

    await CommentRepository.deleteComment(commentId);
  }

  async getComments(
    filters: CommentFilters,
    page: number,
    limit: number,
    sortBy: string
  ): Promise<IComment[]> {
    const aggregationPipeline: any[] = [];
    const matchStage: any = {};
    let comments = [];
    if (filters.userId)
      matchStage.userId = new mongoose.Types.ObjectId(filters.userId);
    if (filters.quizId)
      matchStage.quizId = new mongoose.Types.ObjectId(filters.quizId);

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

    comments = await CommentRepository.getComments(aggregationPipeline);

    return sortComments(comments, sortBy);
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
