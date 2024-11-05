import { Request, Response } from "express";

export const addRating = async (req: Request, res: Response) => {
  try {
    res.status(200).json();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
