import quizRepository from "../repository/quiz.repository";
import ratingRepository from "../repository/rating.repository";
import { ObjectId } from "mongoose";
import validationService from "./validation.service";
import commentRepository from "../repository/comment.repository";

async function manageCommentRatingIfExist(
  userId: ObjectId,
  quizId: ObjectId,
  value: number
): Promise<void> {
  const commentData = await commentRepository.findCommentByData(userId, quizId);

  if (commentData) {
    const { _id: commentId } = commentData;
    await commentRepository.editRating(commentId, value);
  }
}

class RatingService {
  async addRating(
    userId: ObjectId,
    quizId: ObjectId,
    rating: number
  ): Promise<string> {
    if (rating !== -1 && rating !== 1)
      throw new Error("Rating must be positive or negative");

    await validationService.validateUser(userId);
    await validationService.validateQuiz(quizId);

    const ratingExist = await ratingRepository.findRatingByData(userId, quizId);

    if (ratingExist?.rating === rating)
      return "You can`t edit rating to the same value.";

    manageCommentRatingIfExist(userId, quizId, rating);

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
    await validationService.validateUser(userId);

    const rating = await ratingRepository.findRatingById(ratingId);
    if (!validationService.isAuthorized(userId, rating.userId))
      throw new Error("You can delete only your own ratings.");
    manageCommentRatingIfExist(userId, rating.quizId, 0);
    await ratingRepository.delete(ratingId);
    await quizRepository.deleteRating(rating.quizId, rating.rating);
    return "Your rating has been successfully deleted.";
  }

  // Maybe its useless, depends on approach on finishing Quiz, but for now - its here and possible to use
  async checkIfRated(userId: ObjectId, quizId: ObjectId): Promise<number> {
    await validationService.validateUser(userId);
    await validationService.validateQuiz(quizId);

    return (
      (await ratingRepository.findRatingByData(userId, quizId))?.rating || 0
    );
  }
}

module.exports = new RatingService();
