import { ClientSession, ObjectId } from "mongoose";
// import { IUserProfile } from "../models/userProfile.model";
import { IAchievement } from "../models/achievement.model";
import { IUser } from "../models/user.model";
import { PreferencesFilters } from "../types/interfaces";
import { IUserProfile } from "../models/userProfile.model";

const UserProfile = require("../models/userProfile.model");

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

  async findUserProfileById(
    userId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IUserProfile> {
    const user = await UserProfile.findOne({ user: userId })
      .session(options?.session)
      .populate("user")
      .lean();
    return user;
  }

  async editPreferences(
    userId: ObjectId,
    updateFields: Partial<PreferencesFilters>
  ) {
    return await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: updateFields },
      { runValidators: true }
    );
  }

  async addTitle(
    userId: ObjectId,
    title: string,
    options: { session: ClientSession }
  ) {
    await UserProfile.findOneAndUpdate(
      { user: userId },
      { $push: { titles: title } },
      { session: options.session }
    );
  }

  async addValueToAchievement(
    userId: ObjectId,
    achievementName: string,
    achievementIncreaseValue: number,
    options: { session: ClientSession }
  ): Promise<any> {
    const user = await UserProfile.findOneAndUpdate(
      {
        user: userId,
        "achievements.name": achievementName,
      },
      {
        $inc: {
          "achievements.$.value": achievementIncreaseValue,
        },
      },
      { new: true, session: options.session }
    );

    const achievement = user.achievements.find(
      (achievement: IAchievement) => achievement.name === achievementName
    );
    return achievement;
  }

  async changeAchievementLevel(
    userId: ObjectId,
    achievementName: string,
    options: { session: ClientSession }
  ): Promise<number> {
    const user = await UserProfile.findOneAndUpdate(
      {
        user: userId,
        "achievements.name": achievementName,
      },
      {
        $inc: {
          "achievements.$.level": 1,
        },
      },
      { new: true, session: options.session }
    );

    const achievement = user.achievements.find(
      (achievement: IAchievement) => achievement.name === achievementName
    );
    return achievement.level;
  }

  async verifyIfUserHaveTitle(
    userId: ObjectId,
    title: string,
    options?: { session: ClientSession }
  ): Promise<boolean> {
    const user = await UserProfile.findOne(
      { user: userId },
      { titles: 1 },
      { session: options?.session }
    );

    return user.titles.includes(title);
  }

  async deleteUserProfile(
    userId: ObjectId,
    options: { session: ClientSession }
  ) {
    await UserProfile.deleteOne({ user: userId }, { session: options.session });
  }
}

export default new UserProfileRepository();
