import mongoose from "mongoose";
import { IAchievement } from "../models/achievement.model";

const UserPrivate = require("../models/userPrivate.model");
const User = require("../models/user.model");
const UserProfile = require("../models/userProfile.model");

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
    const userExistLogin = await UserPrivate.findOne({ login });
    const userExistEmail = await UserPrivate.findOne({ email });

    if (userExistLogin || userExistEmail)
      throw new Error("User already exists.");

    if (password.length < 8)
      throw new Error("Password must be at least 8 characters long.");

    if (!passwordRegex.test(password))
      throw new Error(
        "Password must be at least 8 characters long and include at least one letter and one digit."
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nickname,
      profilePicture: process.env.DEFAULT_PROFILE_PICTURE,
    });

    const userPrivate = await UserPrivate.create({
      userId: user._id,
      login,
      password: hashedPassword,
      email,
    });

    const allAchievements = await AchievementService.getAchievements();
    const achievements = allAchievements.map((achievement: IAchievement) => ({
      achievementId: achievement._id,
      name: achievement.name,
      level: 1,
    }));

    const userProfile = await UserProfile.create({
      userId: user._id,
      // theme: "default",
      achievements: achievements,
    });

    if (!user || !userPrivate || !userProfile)
      throw new Error("Invalid user data");

    return {
      ...user,
      token: generateToken(user._id),
    };
  }

  async loginUser(login: string, password: string): Promise<any> {
    const userPrivate = await UserPrivate.findOne({ login });
    if (!userPrivate) throw new Error("Invalid login or password");
    const user = await User.findOne(userPrivate.userId);
    if (!user) throw new Error("User does not exist");

    const isPasswordValid = await bcrypt.compare(
      password,
      userPrivate.password
    );

    if (!isPasswordValid) throw new Error("Invalid login or password");

    return {
      ...user,
      token: generateToken(user._id),
    };
  }

  async editUser(login: string) {}

  async editProfilePicture(
    userId: mongoose.Schema.Types.ObjectId,
    imgSource: string
  ) {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imgSource },
      { new: true }
    );

    return user;
  }
}

module.exports = new UserService();
