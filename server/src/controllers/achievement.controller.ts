import { Request, Response } from "express";

const AchievementService = require("../services/achievement.service");

export const getAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await AchievementService.getAchievements();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
