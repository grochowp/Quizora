import mongoose from "mongoose";
import { IAchievement } from "../models/achievement.model";
import userRepository from "../repository/user.repository";
import UserPrivateRepository from "../repository/userPrivate.repository";
import UserProfileRepository from "../repository/userProfile.repository";
import userProfileRepository from "../repository/userProfile.repository";
import { IUser } from "../models/user.model";

const UserPrivate = require("../models/userPrivate.model");
const User = require("../models/user.model");

const AchievementService = require("./achievement.service");

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
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
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

      const loggedUser = await userProfileRepository.login(userPrivate.userId, {
        session,
      });
      if (!user) throw new Error("User does not exist");
      const userTokenData = loggedUser.user as IUser;
      await session.commitTransaction();
      return {
        ...loggedUser,
        token: generateToken(userTokenData._id),
      };
    } catch (error) {
      session.abortTransaction();
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }

  async loginUser(login: string, password: string): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const userPrivate = await UserPrivateRepository.findByLogin(login, {
        session,
      });
      if (!userPrivate) throw new Error("Invalid login or password");
      const isPasswordValid = await bcrypt.compare(
        password,
        userPrivate.password
      );

      if (!isPasswordValid) throw new Error("Invalid login or password");

      const user = await userProfileRepository.login(userPrivate.userId, {
        session,
      });
      if (!user) throw new Error("User does not exist");
      const userTokenData = user.user as IUser;
      await session.commitTransaction();
      return {
        ...user,
        token: generateToken(userTokenData._id),
      };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }

  async editUser() {}

  async editProfilePicture() {}
}

module.exports = new UserService();
