const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import userRepository from "../repository/user.repository";

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
      req.user = await userRepository.findUserWithUserProfileById(decoded.id);
      if (!req.user) throw new Error("Unauthorized");
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

const userTokenData = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Token not provided" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findUserWithUserProfileById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("JWT verification error:", error); // Wyświetl dokładny błąd
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken, userTokenData };
