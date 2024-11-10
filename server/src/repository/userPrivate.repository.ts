import { ClientSession, ObjectId } from "mongoose";
import { IUserPrivate } from "../models/userPrivate.model";

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
}

export default new UserPrivateRepository();
