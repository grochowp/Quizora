import { ObjectId } from "mongoose";
import { IUser } from "../models/user.model";

const User = require("../models/user.model");
const UserProfile = require("../models/userProfile.model");

class UserRepository {
  async create(nickname: string): Promise<IUser> {
    return await User.create({
      nickname,
      profilePicture: process.env.DEFAULT_PROFILE_PICTURE,
    });
  }

  async login(userId: ObjectId): Promise<IUser | null> {
    return await User.findById({ _id: userId });
  }
}

export default new UserRepository();
