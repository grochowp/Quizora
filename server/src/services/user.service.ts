import mongoose, { ClientSession, ObjectId } from "mongoose";
import { IAchievement } from "../models/achievement.model";
import userRepository from "../repository/user.repository";
import UserPrivateRepository from "../repository/userPrivate.repository";
import UserProfileRepository from "../repository/userProfile.repository";
import userProfileRepository from "../repository/userProfile.repository";
import { IUser } from "../models/user.model";
import { withTransaction } from "../utils/transaction";
import { PreferencesFilters } from "../types/interfaces";
import achievementRepository from "../repository/achievement.repository";

const AchievementService = require("./achievement.service");
const ValidationService = require("./validation.service");

const bcrypt = require("bcrypt");
const { generateToken } = require("../config/authentication");

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

class UserService {
  async registerUser(
    login: string,
    password: string,
    email: string,
    nickname: string
  ): Promise<any> {
    return withTransaction(async (session) => {
      const userExistLogin = await UserPrivateRepository.findByLogin(login, {
        session,
      });
      if (userExistLogin)
        throw new Error("User with this login already exists.");
      const userExistEmail = await UserPrivateRepository.findByEmail(email, {
        session,
      });
      if (userExistEmail)
        throw new Error("User with this email already exists.");
      const userExistNickname = await userRepository.findByNickname(nickname, {
        session,
      });
      if (userExistNickname)
        throw new Error("User with this nickname already exists.");

      if (password.length < 8)
        throw new Error("Password must be at least 8 characters long.");

      if (!passwordRegex.test(password))
        throw new Error(
          "Password must be at least 8 characters long and include at least one letter and one digit."
        );

      const hashedPassword = await bcrypt.hash(password, 10);

      const allAchievements = await AchievementService.getAchievements({
        session,
      });

      const achievements = allAchievements.map((achievement: IAchievement) => ({
        achievementId: achievement._id,
        name: achievement.name,
        level: 1,
      }));
      const user = await userRepository.create(nickname, { session });

      const userPrivate = await UserPrivateRepository.create(
        user._id,
        login,
        hashedPassword,
        email,
        { session }
      );

      const userProfile = await UserProfileRepository.create(
        user._id,
        achievements,
        { session }
      );

      if (!user || !userPrivate || !userProfile)
        throw new Error("Invalid user data");

      const loggedUser = await userProfileRepository.findById(
        userPrivate.userId,
        {
          session,
        }
      );
      if (!user) throw new Error("User does not exist");
      const userTokenData = loggedUser.user as IUser;
      return {
        ...loggedUser,
        token: generateToken(userTokenData._id),
      };
    });
  }

  async loginUser(login: string, password: string): Promise<any> {
    const userPrivate = await UserPrivateRepository.findByLogin(login);
    if (!userPrivate) throw new Error("Invalid login or password");
    const isPasswordValid = await bcrypt.compare(
      password,
      userPrivate.password
    );

    if (!isPasswordValid) throw new Error("Invalid login or password");

    const user = await userProfileRepository.findById(userPrivate.userId);
    if (!user) throw new Error("User does not exist");
    const userTokenData = user.user as IUser;
    return {
      ...user,
      token: generateToken(userTokenData._id),
    };
  }

  async findUserById(userId: ObjectId) {
    await ValidationService.validateUser(userId);
    return userRepository.findUserById(userId);
  }

  async getMultipleUsers(
    query: string,
    page: number,
    limit: number,
    sortBy: "points" | "finishedQuizzes" | "createdQuizzes"
  ) {
    const skip = (page - 1) * limit;
    const sortOptions: Record<string, 1 | -1> = {};
    if (sortBy) {
      sortOptions[sortBy] = -1;
    }
    const users = await userRepository.getMultipleUsers(
      query,
      skip,
      limit,
      sortOptions
    );
    return users;
  }

  async editUser() {}

  async editProfilePicture() {}

  async editPreferences(userId: ObjectId, filters: PreferencesFilters) {
    const updateFields: Partial<PreferencesFilters> = {};
    await ValidationService.validateUser(userId);
    const userProfile = await UserProfileRepository.findById(userId);

    (Object.keys(filters) as (keyof PreferencesFilters)[]).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== userProfile[key]) {
        updateFields[key] = value as any;
      }
    });

    if (Object.keys(updateFields).length > 0) {
      await UserProfileRepository.editPreferences(userId, updateFields);
      return "Preferences updated.";
    } else throw new Error("No changes selected.");
  }

  async handleAchievementUpdate(
    userId: ObjectId,
    achievementName: string,
    achievementIncreaseValue: number,
    session: ClientSession
  ): Promise<string | undefined> {
    await ValidationService.validateUser(userId);

    const achievementValue = await userProfileRepository.addRatingToAchievement(
      userId,
      achievementName,
      achievementIncreaseValue,
      { session }
    );
    if (!achievementValue)
      throw new Error(
        `Failed to fetch your ${achievementName} achievement progress.`
      );

    const achievement = await achievementRepository.getSingleAchievement(
      achievementName,
      { session }
    );
    if (!achievement)
      throw new Error(`Failed to fetch your ${achievementName} achievement.`);

    for (const level of achievement.levels) {
      if (level.requirement === achievementValue) {
        const achievementLevel =
          await userProfileRepository.changeAchievementLevel(
            userId,
            achievementName,
            { session }
          );
        if (!achievementLevel)
          throw new Error(
            `Failed to change your ${achievementName} achievement level.`
          );

        const currentLevel = achievement.levels.find(
          (lvl: any) => lvl.level === achievementLevel
        );

        const existingTitle = await userProfileRepository.verifyUserTitle(
          userId,
          currentLevel.title,
          { session }
        );
        if (existingTitle)
          return `Title ${currentLevel.title} has been already at your account.`;

        if (currentLevel && currentLevel.title) {
          await userProfileRepository.addTitle(userId, currentLevel.title, {
            session,
          });
          return `Title ${currentLevel.title} has been granted to your account.`;
        }
      }
    }
  }
}

module.exports = new UserService();
