import { ObjectId } from "mongoose";
import { IUserProfile } from "../models/userProfile.model";
import { IAchievement } from "../models/achievement.model";

const UserProfile = require("../models/userProfile.model");

class UserProfileRepository {
  async create(
    userId: ObjectId,
    achievements: IAchievement[]
  ): Promise<IUserProfile> {
    return await UserProfile.create({
      userId,
      achievements,
    });
  }
}

export default new UserProfileRepository();
