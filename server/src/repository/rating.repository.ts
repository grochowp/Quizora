import { IRating } from "../models/rating.model";

const Rating = require("../models/rating.model");

class RatingRepository {
  async create(ratingData: any): Promise<IRating> {
    return await Rating.create(ratingData);
  }
}

export default new RatingRepository();
