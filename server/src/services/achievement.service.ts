import { ClientSession } from "mongoose";
import { IAchievement } from "../models/achievement.model";
import AchievementRepository from "../repository/achievement.repository";

class AchievementService {
  async getAchievements(options?: {
    session: ClientSession;
  }): Promise<IAchievement> {
    const achievements = await AchievementRepository.get(options);
    return achievements;
  }

  async addAchievements(achievementData: IAchievement) {
    return await AchievementRepository.create(achievementData);
  }
}

module.exports = new AchievementService();
