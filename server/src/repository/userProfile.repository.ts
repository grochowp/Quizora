import { ObjectId } from "mongoose";
import { IUserProfile } from "../models/userProfile.model";
import { IAchievement } from "../models/achievement.model";
import { IUser } from "../models/user.model";

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

  async login(userId: ObjectId): Promise<IUser & IUserProfile> {
    return await UserProfile.find({ userId }).populate("userId").lean();
  }
}

export default new UserProfileRepository();
