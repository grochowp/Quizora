import mongoose, { ObjectId } from "mongoose";
import { IComment } from "../models/comment.model";
import CommentRepository from "../repository/comment.repository";
import QuizRepository from "../repository/quiz.repository";
import UserRepository from "../repository/user.repository";
import { CommentFilters } from "../types/interfaces";

class CommentService {
  async addComment(
    userId: ObjectId,
    quizId: ObjectId,
    comment: string,
    rating: number
  ): Promise<IComment> {
    if (comment.length < 5)
      throw new Error(
        "Your comment is too short. It must be at least 5 characters"
      );
    if (comment.length > 60)
      throw new Error(
        "Your comment is too long. It must be maximum of 60 characters"
      );

    const existingUser = await UserRepository.findUserById(userId);
    if (!existingUser)
      throw new Error("Invalid data. User with this ID does not exist.");
    const existingQuiz = await QuizRepository.findQuizById(quizId);
    if (!existingQuiz)
      throw new Error("Invalid data. Quiz with this ID does not exist.");

    const existingComment = await CommentRepository.checkExistence(
      userId,
      quizId
    );
    if (existingComment) throw new Error("You already commented this Quiz.");

    return await CommentRepository.addComment(userId, quizId, comment, rating);
  }

  async deleteComment(commentId: ObjectId) {
    await CommentRepository.deleteComment(commentId);
  }

  async getComments(
    filters: CommentFilters,
    page: number,
    limit: number
  ): Promise<IComment[]> {
    const aggregationPipeline: any[] = [];
    const matchStage: any = {};
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
    return await CommentRepository.getComments(aggregationPipeline);
  }
}

module.exports = new CommentService();
