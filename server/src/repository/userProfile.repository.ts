import { ClientSession, ObjectId } from "mongoose";
// import { IUserProfile } from "../models/userProfile.model";
import { IAchievement } from "../models/achievement.model";
import { IUser } from "../models/user.model";

const UserProfile = require("../models/userProfile.model");

interface IUserProfile {
  // Other properties
  user: ObjectId | IUser;
}
class UserProfileRepository {
  async create(
    userId: ObjectId,
    achievements: IAchievement[],
    options: { session: ClientSession }
  ): Promise<IUserProfile> {
    const newUserProfile = await UserProfile.create(
      [{ user: userId, achievements }],
      options
    );
    return newUserProfile[0];
  }

  async login(
    userId: ObjectId,
    options: { session: ClientSession }
  ): Promise<IUser & IUserProfile> {
    const user = await UserProfile.findOne({ user: userId })
      .session(options.session)
      .populate("user")
      .lean();
    return user;
  }
}

export default new UserProfileRepository();
