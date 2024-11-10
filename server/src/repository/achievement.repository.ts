import { ClientSession } from "mongoose";
import { IAchievement } from "../models/achievement.model";

const Achievement = require("../models/achievement.model");

class AchievementRepository {
  async get(options?: { session: ClientSession }): Promise<IAchievement> {
    return await Achievement.find().session(options?.session);
  }
}

export default new AchievementRepository();
