import quizRepository from "../repository/quiz.repository";
import ratingRepository from "../repository/rating.repository";
import mongoose, { ObjectId } from "mongoose";

const CommentService = require("./comment.service");
const ValidationService = require("./validation.service");

class RatingService {
  async addRating(
    userId: ObjectId,
    quizId: ObjectId,
    rating: number
  ): Promise<string> {
    if (rating !== -1 && rating !== 1)
      throw new Error("Rating must be positive or negative");

    await ValidationService.validateUser(userId);
    await ValidationService.validateQuiz(quizId);

    const ratingExist = await ratingRepository.findRatingByData(userId, quizId);

    if (ratingExist?.rating === rating)
      return "You can`t edit rating to the same value.";

    await CommentService.manageCommentRatingIfExist(userId, quizId, rating);

    if (ratingExist) {
      await ratingRepository.edit(ratingExist._id, rating);
      await quizRepository.editRating(quizId, rating);
      return "Your rating has been successfully updated.";
    }

    await ratingRepository.create(userId, quizId, rating);
    await quizRepository.addRating(quizId, rating);
    return "Your rating has been successfully added.";
  }

  async deleteRating(userId: ObjectId, quizId: ObjectId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await ValidationService.validateUser(userId);
      await ValidationService.validateQuiz(quizId);

      const rating = await ratingRepository.findRatingByData(userId, quizId, {
        session,
      });
      if (!rating)
        throw new Error("Rating with this UserId and QuizId does not exist.");

      ValidationService.isAuthorized(
        userId,
        rating.userId,
        "You can delete only your own ratings."
      );

      await CommentService.manageCommentRatingIfExist(
        userId,
        rating.quizId,
        0,
        { session }
      );

      const ratingDeleted = await ratingRepository.delete(rating._id, {
        session,
      });

      if (!ratingDeleted) throw new Error("Failed to delete rating.");
      const QuizRatingDeleted = await quizRepository.deleteRating(
        rating.quizId,
        rating.rating,
        { session }
      );

      if (!QuizRatingDeleted)
        throw new Error("Failed to delete rating from quiz.");
      session.commitTransaction();
      return "Your rating has been successfully deleted.";
    } catch (error) {
      session.abortTransaction();
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }

  // Maybe its useless, depends on approach on finishing Quiz, but for now - its here and possible to use
  async checkIfRated(userId: ObjectId, quizId: ObjectId): Promise<number> {
    await ValidationService.validateUser(userId);
    await ValidationService.validateQuiz(quizId);

    return (
      (await ratingRepository.findRatingByData(userId, quizId))?.rating || 0
    );
  }
}

module.exports = new RatingService();
