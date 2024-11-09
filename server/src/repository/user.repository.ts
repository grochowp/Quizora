import { ObjectId } from "mongoose";
import { IUser } from "../models/user.model";
import { IUserProfile } from "../models/userProfile.model";

const User = require("../models/user.model");
const UserProfile = require("../models/userProfile.model");

class UserRepository {
  async create(nickname: string): Promise<IUser> {
    return await User.create({
      nickname,
    }).lean();
  }

  async findUserById(userId: ObjectId): Promise<IUser | null> {
    return await User.findById(userId);
  }
}

export default new UserRepository();
