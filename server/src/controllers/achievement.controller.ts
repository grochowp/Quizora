import { Request, Response } from "express";

const AchievementService = require("../services/achievement.service");

const getAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await AchievementService.getAchievements();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const addAchievements = async (req: Request, res: Response) => {
  const { achievementData } = req.body;
  try {
    const achievement = await AchievementService.addAchievements(
      achievementData
    );
    res.status(200).json(achievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAchievements, addAchievements };
