import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { IUserPrivate } from "../models/userPrivate.model";
import { PreferencesFilters, UserTokenRequest } from "../types/interfaces";

const UserService = require("../services/user.service");

const register = async (req: Request, res: Response) => {
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

const login = async (req: Request, res: Response) => {
  const { login, password } = req.body;

  try {
    const user = await UserService.loginUser(login, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editProfilePicture = async (
  req: Request & UserTokenRequest,
  res: Response
) => {
  const { _id: userId } = req.user;
  const { imgSource } = req.params;

  try {
    const user = await UserService.editProfilePicture(userId, imgSource);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAccount = async (req: Request, res: Response) => {};

const editPreferences = async (
  req: Request & UserTokenRequest,
  res: Response
) => {
  const filters: PreferencesFilters = {};

  const { _id: userId } = req.user;
  if (req.query.theme) filters.theme = req.query.theme as string;
  if (req.query.checkpoints)
    filters.checkpoints = req.query.checkpoints === "true";
  if (req.query.lessAnimations)
    filters.lessAnimations = req.query.lessAnimations === "true";
  if (req.query.privateAccount)
    filters.privateAccount = req.query.privateAccount === "true";

  try {
    const message = await UserService.editPreferences(userId, filters);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await UserService.findUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMultipleUsers = async (req: Request, res: Response) => {
  const query = req.query.query || "";
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sortBy = req.query.sortBy || "points";

  try {
    const users = await UserService.getMultipleUsers(
      query,
      page,
      limit,
      sortBy
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  editProfilePicture,
  editPreferences,
  getUser,
  getMultipleUsers,
};
