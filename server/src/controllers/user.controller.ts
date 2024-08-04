import { Request, Response } from "express";

const UserService = require("../services/user.service");

interface IUserRequest extends Request {
  body: {
    login: string;
    email?: string;
    password: string;
  };
}

const register = async (req: IUserRequest, res: Response) => {
  const { login, email, password } = req.body;

  try {
    const user = await UserService.registerUser(login, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req: IUserRequest, res: Response) => {
  const { login, password } = req.body;

  try {
    const user = await UserService.loginUser(login, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
