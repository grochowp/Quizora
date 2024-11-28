import mongoose, { Document } from "mongoose";
import { IQuizDetails } from "./quizDetails.model";

export interface IQuiz extends Document {
  _id: mongoose.ObjectId;
  title: string;
  description: string;
  time: number;
  category: string;
  createdBy: mongoose.ObjectId;
  updatedAt: Date;
  rating: number;
  points: number;
  difficulty: string;
  status: "draft" | "archived" | "published";
  quizDetails: IQuizDetails | mongoose.ObjectId;
}

const quizSchema = new mongoose.Schema<IQuiz>({
  title: {
    type: String,
    minlength: [5, "Tytuł musi zawierać co najmniej 5 znaków"],
    maxlength: [30, "Tytuł może zawierać maksymalnie 30 znaków"],
    required: [true, "Tytuł jest wymagany"],
  },
  description: {
    type: String,
    required: [true, "Opis jest wymagany"],
    minlength: [5, "Opis musi zawierać co najmniej 5 znaków"],
    maxlength: [120, "Opis może zawierać maksymalnie 120 znaków"],
  },

  time: { type: Number, min: 1, max: 10, required: true },
  category: {
    type: String,
    required: true,
    enum: {
      values: ["programming", "history", "entertainment", "geography", "sport"],
      message:
        "Available categories: 'programming', 'history', 'entertainment', 'geography', 'sport'.",
    },
  },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  updatedAt: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 },
  points: {
    type: Number,
    min: 5,
    max: 90,
    required: true,
  },
  difficulty: {
    type: String,
    enum: {
      values: ["easy", "medium", "hard"],
      message: "Difficulty must be 'easy', 'medium', or 'hard'.",
    },
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["draft", "published", "archived"],
      message: "Status must be 'draft', 'published', or 'archived'.",
    },
    default: "published",
    required: true,
  },
  quizDetails: { type: mongoose.Types.ObjectId, ref: "QuizDetails" },
});

module.exports = mongoose.model("Quiz", quizSchema);
