import { ObjectId } from "mongoose";
import { IRating } from "../models/rating.model";

const Rating = require("../models/rating.model");

class RatingRepository {
  async create(userId: ObjectId, quizId: ObjectId, rating: number) {
    await Rating.create({ userId, quizId, rating });
  }
  async findRatingByData(userId: ObjectId, quizId: ObjectId): Promise<IRating> {
    return Rating.findOne({ userId, quizId });
  }

  async edit(ratingId: ObjectId, rating: number) {
    await Rating.findOneAndUpdate({ _id: ratingId }, { $set: { rating } });
  }

  async findRatingById(ratingId: ObjectId): Promise<IRating> {
    return await Rating.findOne({ _id: ratingId });
  }

  async delete(ratingId: ObjectId) {
    await Rating.findOneAndDelete(ratingId);
  }
}

export default new RatingRepository();
