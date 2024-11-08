const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { IUser } from "../models/user.model";

interface IUserRequest extends Request {
  user: IUser;
}

const verifyToken = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Unauthorized" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { verifyToken };
