import { ClientSession, ObjectId } from "mongoose";
import { IUser } from "../models/user.model";

const User = require("../models/user.model");

class UserRepository {
  async create(
    nickname: string,
    userProfileId: ObjectId,
    options: { session: ClientSession }
  ): Promise<IUser> {
    const newUser = await User.create(
      [{ nickname, userProfile: userProfileId }],
      {
        session: options.session,
        runValidators: true,
      }
    );
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
      {
        session: options.session,
        runValidators: true,
      }
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
      { new: true, runValidators: true }
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
      { new: true, session: options.session, runValidators: true }
    ).select("-_id nickname");
  }

  async deleteUser(userId: ObjectId, options: { session: ClientSession }) {
    await User.deleteOne({ _id: userId }, { session: options.session });
  }

  async findUserWithUserProfileById(
    userId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<IUser> {
    const user = await User.findById(userId)
      .populate("userProfile")
      .session(options?.session)
      .lean();
    return user;
  }

  async editPrivateAccount(
    userId: ObjectId,
    privateAccount: boolean,
    options: { session: ClientSession }
  ) {
    await User.findByIdAndUpdate(
      userId,
      { $set: { privateAccount } },
      {
        session: options.session,
        runValidators: true,
      }
    );
  }
}

export default new UserRepository();
