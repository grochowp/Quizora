import { ClientSession, ObjectId } from "mongoose";
import { IUserPrivate } from "../models/userPrivate.model";
import { EditProfileFilters } from "../types/interfaces";

const UserPrivate = require("../models/userPrivate.model");

class UserPrivateRepository {
  async create(
    userId: ObjectId,
    login: string,
    password: string,
    email: string,
    options: { session: ClientSession }
  ): Promise<IUserPrivate> {
    const newUserPrivate = await UserPrivate.create(
      [{ userId, login, password, email }],
      options
    );
    return newUserPrivate[0];
  }

  async getOldPassword(
    userId: ObjectId,
    options?: { session: ClientSession }
  ): Promise<string> {
    const userPrivate = await UserPrivate.findOne({ userId })
      .session(options?.session)
      .select("-_id password");
    return userPrivate.password;
  }

  async findByLogin(
    login: string,
    options?: { session: ClientSession }
  ): Promise<IUserPrivate | null> {
    return await UserPrivate.findOne({ login }).session(options?.session);
  }

  async findByEmail(
    email: string,
    options?: { session: ClientSession }
  ): Promise<IUserPrivate | null> {
    return await UserPrivate.findOne({ email }).session(options?.session);
  }

  async editProfile(
    userId: ObjectId,
    filters: EditProfileFilters,
    options: { session: ClientSession }
  ): Promise<IUserPrivate> {
    return await UserPrivate.findOneAndUpdate(
      { userId },
      { $set: filters },
      { new: true, session: options.session, runValidators: true }
    ).select("-_id login email");
  }

  async deleteUserPrivate(
    userId: ObjectId,
    options: { session: ClientSession }
  ) {
    await UserPrivate.deleteOne({ userId }, { session: options.session });
  }
}

export default new UserPrivateRepository();
