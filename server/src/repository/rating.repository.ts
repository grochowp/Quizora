import { ClientSession, ObjectId } from "mongoose";
import { IRating } from "../models/rating.model";

const Rating = require("../models/rating.model");

class RatingRepository {
  async create(userId: ObjectId, quizId: ObjectId, rating: number) {
    await Rating.create({ userId, quizId, rating });
  }
  async findRatingByData(
    userId: ObjectId,
    quizId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IRating> {
    return Rating.findOne({ userId, quizId }).session(options?.session);
  }

  async edit(ratingId: ObjectId, rating: number) {
    await Rating.findOneAndUpdate({ _id: ratingId }, { $set: { rating } });
  }

  async findRatingById(ratingId: ObjectId): Promise<IRating> {
    return await Rating.findOne({ _id: ratingId });
  }

  async delete(
    ratingId: ObjectId,
    options: { session: ClientSession }
  ): Promise<boolean> {
    const result = await Rating.deleteOne(ratingId, options);
    return result.deletedCount > 0;
  }

  async deleteQuizRatings(
    quizId: ObjectId,
    options: { session: ClientSession }
  ) {
    return await Rating.deleteMany({ quizId }, options);
  }
}

export default new RatingRepository();
