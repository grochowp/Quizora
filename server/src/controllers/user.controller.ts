import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { IUserPrivate } from "../models/userPrivate.model";
import { IUserProfile } from "../models/userProfile.model";
import UserService from "../services/user.service";
interface IUserRequest extends Request {
  body: IUserPrivate & IUserProfile & IUser;
  user: IUser;
}

export const register = async (req: IUserRequest, res: Response) => {
  const { login, password, email, nickname } = req.body;

  try {
    const user = await UserService.registerUser(
      login,
      password,
      email,
      nickname
    );
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: IUserRequest, res: Response) => {
  const { login, password } = req.body;

  try {
    const user = await UserService.loginUser(login, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editProfilePicture = async (req: IUserRequest, res: Response) => {
  const { _id: userId } = req.user;
  const { imgSource } = req.params;

  try {
    const user = await UserService.editProfilePicture(userId, imgSource);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  editProfilePicture,
};
