import mongoose from "mongoose";
import { IAchievement } from "../models/achievement.model";
import userRepository from "../repository/user.repository";
import UserPrivateRepository from "../repository/userPrivate.repository";
import UserProfileRepository from "../repository/userProfile.repository";

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
    const userExistLogin = await UserPrivateRepository.findByLogin(login);
    const userExistEmail = await UserPrivateRepository.findByEmail(email);

    if (userExistLogin || userExistEmail)
      throw new Error("User already exists.");

    if (password.length < 8)
      throw new Error("Password must be at least 8 characters long.");

    if (!passwordRegex.test(password))
      throw new Error(
        "Password must be at least 8 characters long and include at least one letter and one digit."
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const allAchievements = await AchievementService.getAchievements();
    const achievements = allAchievements.map((achievement: IAchievement) => ({
      achievementId: achievement._id,
      name: achievement.name,
      level: 1,
    }));
    const user = await userRepository.create(nickname);
    const userPrivate = await UserPrivateRepository.create(
      user._id,
      login,
      hashedPassword,
      email
    );
    const userProfile = await UserProfileRepository.create(
      user._id,
      achievements
    );

    if (!user || !userPrivate || !userProfile)
      throw new Error("Invalid user data");

    return {
      ...user,
      token: generateToken(user._id),
    };
  }

  async loginUser(login: string, password: string): Promise<any> {
    const userPrivate = await UserPrivateRepository.findByLogin(login);
    if (!userPrivate) throw new Error("Invalid login or password");

    const isPasswordValid = await bcrypt.compare(
      password,
      userPrivate.password
    );

    if (!isPasswordValid) throw new Error("Invalid login or password");

    const user = await userRepository.login(userPrivate.userId);
    if (!user) throw new Error("User does not exist");

    return {
      ...user,
      token: generateToken(user._id),
    };
  }

  async editUser() {}

  async editProfilePicture() {}
}

module.exports = new UserService();
