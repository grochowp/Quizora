import quizRepository from "../repository/quiz.repository";
import ratingRepository from "../repository/rating.repository";
import { ObjectId } from "mongoose";

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

  async deleteRating(userId: ObjectId, ratingId: ObjectId) {
    await ValidationService.validateUser(userId);

    const rating = await ratingRepository.findRatingById(ratingId);
    ValidationService.isAuthorized(
      userId,
      rating.userId,
      "You can delete only your own ratings."
    );

    await CommentService.manageCommentRatingIfExist(userId, rating.quizId, 0);

    await ratingRepository.delete(ratingId);
    await quizRepository.deleteRating(rating.quizId, rating.rating);
    return "Your rating has been successfully deleted.";
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
