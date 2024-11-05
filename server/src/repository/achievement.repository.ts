import { IAchievement } from "../models/achievement.model";

const Achievement = require("../models/achievement.model");

class AchievementRepository {
  async get(): Promise<IAchievement> {
    return await Achievement.find();
  }
}

export default new AchievementRepository();
