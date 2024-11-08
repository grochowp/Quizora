import userRepository from "../repository/user.repository";
import quizRepository from "../repository/quiz.repository";
import ratingRepository from "../repository/rating.repository";
import { ObjectId } from "mongoose";

class RatingService {
  async addRating(
    userId: ObjectId,
    quizId: ObjectId,
    rating: number
  ): Promise<string> {
    if (rating !== -1 && rating !== 1)
      throw new Error("Rating must be positive or negative");

    const userExist = userRepository.findUserById(userId);
    if (!userExist)
      throw new Error("Invalid data. User with this ID does not exist.");

    const quizExist = await quizRepository.findQuizById(quizId);
    if (!quizExist)
      throw new Error("Invalid data. Quiz with this ID does not exist.");

    const ratingExist = await ratingRepository.findRatingByData(userId, quizId);
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
    const rating = await ratingRepository.findRatingById(ratingId);
    if (userId.toString() !== rating.userId.toString())
      throw new Error("You can delete only your own ratings.");

    await ratingRepository.delete(ratingId);
    await quizRepository.deleteRating(rating.quizId, rating.rating);
    return "Your rating has been successfully deleted.";
  }
}

module.exports = new RatingService();
