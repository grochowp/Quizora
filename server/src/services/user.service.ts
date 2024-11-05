import mongoose from "mongoose";
import { IUser } from "../models/user.model";
import { IUserPrivate } from "../models/userPrivate.model";

const User = require("../models/user.model");
const UserPrivate = require("../models/userPrivate.model");
const { generateToken } = require("../config/authentication");
const bcrypt = require("bcrypt");

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

class UserService {
  async registerUser(
    login: string,
    password: string,
    email: string,
    nickname: string
  ): Promise<IUser> {
    const userExist = await UserPrivate.findOne({ login });

    if (userExist) throw new Error("User already exists.");

    if (password.length < 8)
      throw new Error("Password must be at least 8 characters long.");

    if (!passwordRegex.test(password))
      throw new Error(
        "Password must be at least 8 characters long and include at least one letter and one digit."
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nickname,
      points: 0,
      profilePicture: process.env.DEFAULT_PROFILE_PICTURE,
      createdAt: new Date(),
      createdQuizzes: [],
      achievements: [],
      titles: [],
      likes: [],
      dislikes: [],
    });

    const userPrivate = await UserPrivate.create({
      userId: user._id,
      login,
      password: hashedPassword,
      email,
    });

    if (!user) throw new Error("Invalid user data");
    if (!userPrivate) throw new Error("Invalid user data");

    return {
      ...user,
      token: generateToken(user._id),
    };
  }

  async loginUser(login: string, password: string): Promise<IUserPrivate> {
    const userPrivate = await UserPrivate.findOne({ login });
    const user = await User.findOne(userPrivate.userId);
    if (!user) throw new Error("Invalid login or password");

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

export default new UserService();
