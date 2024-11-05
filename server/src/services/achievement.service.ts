import { IAchievement } from "../models/achievement.model";
import AchievementRepository from "../repository/achievement.repository";

class AchievementService {
  async getAchievements(): Promise<IAchievement> {
    const achievements = await AchievementRepository.get();
    return achievements;
  }
}

module.exports = new AchievementService();
