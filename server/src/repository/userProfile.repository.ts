import { ClientSession, ObjectId } from "mongoose";
import { IAchievement } from "../models/achievement.model";
import { PreferencesFilters } from "../types/interfaces";
import { IUserProfile } from "../models/userProfile.model";

const UserProfile = require("../models/userProfile.model");

class UserProfileRepository {
  async create(
    achievements: IAchievement[],
    options: { session: ClientSession }
  ): Promise<IUserProfile> {
    const newUserProfile = await UserProfile.create(
      [{ achievements }],
      options
    );
    return newUserProfile[0];
  }

  async findUserProfileById(
    userProfileId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IUserProfile> {
    const user = await UserProfile.findOne({ _id: userProfileId })
      .session(options?.session)
      .lean();
    return user;
  }

  async editPreferences(
    userProfileId: ObjectId,
    updateFields: Partial<PreferencesFilters>
  ) {
    return await UserProfile.findOneAndUpdate(
      { _id: userProfileId },
      { $set: updateFields },
      { runValidators: true }
    );
  }

  async addTitle(
    userProfileId: ObjectId,
    title: string,
    options: { session: ClientSession }
  ) {
    await UserProfile.findOneAndUpdate(
      { _id: userProfileId },
      { $push: { titles: title } },
      { session: options.session }
    );
  }

  async addValueToAchievement(
    userProfileId: ObjectId,
    achievementName: string,
    achievementIncreaseValue: number,
    options: { session: ClientSession }
  ): Promise<any> {
    const user = await UserProfile.findOneAndUpdate(
      {
        _id: userProfileId,
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
    userProfileId: ObjectId,
    achievementName: string,
    options: { session: ClientSession }
  ): Promise<number> {
    const user = await UserProfile.findOneAndUpdate(
      {
        _id: userProfileId,
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
    userProfileId: ObjectId,
    title: string,
    options?: { session: ClientSession }
  ): Promise<boolean> {
    const user = await UserProfile.findOne(
      { _id: userProfileId },
      { titles: 1 },
      { session: options?.session }
    );

    return user.titles.includes(title);
  }

  async deleteUserProfile(
    userProfileId: ObjectId,
    options: { session: ClientSession }
  ) {
    await UserProfile.deleteOne(
      { _id: userProfileId },
      { session: options.session }
    );
  }
}

export default new UserProfileRepository();
