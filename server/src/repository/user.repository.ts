import { ClientSession, ObjectId } from "mongoose";
import { IUser } from "../models/user.model";
import { IUserProfile } from "../models/userProfile.model";

const User = require("../models/user.model");
const UserProfile = require("../models/userProfile.model");

class UserRepository {
  async create(
    nickname: string,
    options: { session: ClientSession }
  ): Promise<IUser> {
    const newUser = await User.create([{ nickname }], options);
    return newUser[0];
  }

  async findUserById(
    userId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IUser | null> {
    return await User.findById(userId).session(options?.session);
  }

  async findByNickname(
    nickname: string,
    options?: { session: ClientSession }
  ): Promise<IUser | null> {
    return await User.findOne({ nickname }).session(options?.session);
  }

  async getMultipleUsers(
    query: string,
    skip: number,
    limit: number,
    sortOptions: Record<string, 1 | -1>
  ) {
    return await User.find({
      nickname: { $regex: query, $options: "i" },
    })
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);
  }

  async addOrSubstractLikedQuizzes(
    userId: ObjectId,
    value: number,
    options: { session: ClientSession }
  ) {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { likedQuizzes: value },
      },
      options
    );
  }

  async addOrSubstractCreatedQuizzes(
    userId: ObjectId,
    value: number,
    options: { session: ClientSession }
  ) {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { createdQuizzes: value },
      },
      options
    );
  }

  async addFinishedQuizData(
    userId: ObjectId,
    points: number,
    options: { session: ClientSession }
  ) {
    await User.findByIdAndUpdate(
      userId,
      {
        $inc: { finishedQuizzes: 1, points },
      },
      options
    );
  }

  async editProfilePicture(userId: ObjectId, imgQuery: string): Promise<IUser> {
    return await User.findByIdAndUpdate(
      userId,
      { profilePicture: imgQuery },
      { new: true }
    );
  }
  async changeDisplayedTitles(
    userId: ObjectId,
    titles: Array<string>
  ): Promise<IUser> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $set: { activeTitles: titles },
      },
      { new: true }
    );
  }

  async changeNickname(
    userId: ObjectId,
    nickname: string,
    options: { session: ClientSession }
  ): Promise<IUser> {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { nickname } },
      { new: true, session: options.session }
    ).select("-_id nickname");
  }
}

export default new UserRepository();
