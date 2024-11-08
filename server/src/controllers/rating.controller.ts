import { Request, Response } from "express";
import { UserTokenRequest } from "../types/interfaces";

const RatingService = require("../services/rating.service");

const addRating = async (req: Request & UserTokenRequest, res: Response) => {
  const { _id: userId } = req.user;
  const { quizId, rating } = req.body;

  try {
    const message = await RatingService.addRating(userId, quizId, rating);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRating = async (req: Request & UserTokenRequest, res: Response) => {
  const { _id: userId } = req.user;
  const { ratingId } = req.params;

  try {
    const message = await RatingService.deleteRating(userId, ratingId);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkIfRated = async (req: Request & UserTokenRequest, res: Response) => {
  const { _id: userId } = req.user;
  const { quizId } = req.params;

  try {
    const rating = await RatingService.checkIfRated(userId, quizId);
    res.status(200).json(rating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addRating, deleteRating, checkIfRated };
