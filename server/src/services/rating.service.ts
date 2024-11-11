import quizRepository from "../repository/quiz.repository";
import ratingRepository from "../repository/rating.repository";
import mongoose, { ObjectId } from "mongoose";
import { withTransaction } from "../utils/transaction";
import userRepository from "../repository/user.repository";
import userProfileRepository from "../repository/userProfile.repository";
import {
  achievementLikedQuizzesRequirements,
  achievementsLikedQuizzesTitles,
  handleAchievementUpdate,
} from "../utils/achievementUtils";

const CommentService = require("./comment.service");
const ValidationService = require("./validation.service");
const userService = require("./user.service");

class RatingService {
  async addRating(
    userId: ObjectId,
    quizId: ObjectId,
    rating: number
  ): Promise<string> {
    return withTransaction(async (session) => {
      if (rating !== -1 && rating !== 1)
        throw new Error("Rating must be positive or negative");
      await ValidationService.validateUser(userId, { session });
      await ValidationService.validateQuiz(quizId, { session });

      const ratingExist = await ratingRepository.findRatingByData(
        userId,
        quizId,
        { session }
      );

      if (ratingExist?.rating === rating)
        return "You can`t edit rating to the same value.";

      await CommentService.manageCommentRatingIfExist(userId, quizId, rating, {
        session,
      });

      if (ratingExist) {
        await ratingRepository.edit(ratingExist._id, rating, { session });
        await quizRepository.editRating(quizId, rating, { session });

        await session.commitTransaction();
        return { message: "Your rating has been successfully updated." };
      }

      await ratingRepository.create(userId, quizId, rating, { session });
      await quizRepository.manageRating(quizId, rating, { session });
      await userRepository.manageRating(userId, 1, { session });

      const titleMessage = await handleAchievementUpdate(
        userId,
        "Oceń Quizy",
        achievementLikedQuizzesRequirements,
        achievementsLikedQuizzesTitles,
        session
      );

      await session.commitTransaction();

      return {
        message: "Your rating has been successfully added.",
        titleMessage,
      };
    });
  }

  async deleteRating(userId: ObjectId, quizId: ObjectId) {
    return withTransaction(async (session) => {
      await ValidationService.validateUser(userId, { session });
      await ValidationService.validateQuiz(quizId, { session });

      const rating = await ratingRepository.findRatingByData(userId, quizId, {
        session,
      });
      if (!rating)
        throw new Error("Rating with this UserId and QuizId does not exist.");

      await ValidationService.isAuthorized(
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

      const QuizRatingDeleted = await quizRepository.manageRating(
        rating.quizId,
        -rating.rating,
        { session }
      );
      if (!QuizRatingDeleted)
        throw new Error("Failed to delete rating from quiz.");
      await userRepository.manageRating(userId, -1, { session });

      await session.commitTransaction();
      return "Your rating has been successfully deleted.";
    });
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
