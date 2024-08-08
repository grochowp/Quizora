import { IAchievement } from "../models/achievement.model";

const Achievement = require("../models/achievement.model");

class AchievementService {
  async getAchievements(): Promise<IAchievement> {
    const achievements = await Achievement.find();
    return achievements;
  }
}

module.exports = new AchievementService();
