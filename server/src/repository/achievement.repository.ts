import { ClientSession } from "mongoose";
import { IAchievement } from "../models/achievement.model";

const Achievement = require("../models/achievement.model");

class AchievementRepository {
  async create(achievementData: IAchievement): Promise<IAchievement> {
    return await Achievement.create(achievementData, { runValidators: true });
  }

  async get(options?: { session: ClientSession }): Promise<IAchievement> {
    return await Achievement.find().session(options?.session);
  }

  async getSingleAchievement(
    achievementName: string,
    options: { session: ClientSession }
  ) {
    return Achievement.findOne({ name: achievementName }).session(
      options.session
    );
  }
}

export default new AchievementRepository();
