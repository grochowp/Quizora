import { ObjectId } from "mongoose";
import { IUserPrivate } from "../models/userPrivate.model";

const UserPrivate = require("../models/userPrivate.model");

class UserPrivateRepository {
  async create(
    userId: ObjectId,
    login: string,
    password: string,
    email: string
  ): Promise<IUserPrivate> {
    return await UserPrivate.create({
      userId,
      login,
      password,
      email,
    });
  }

  async findByLogin(login: string): Promise<IUserPrivate | null> {
    return await UserPrivate.findOne({ login });
  }

  async findByEmail(email: string): Promise<IUserPrivate | null> {
    return await UserPrivate.findOne({ email });
  }
}

export default new UserPrivateRepository();
