import mongoose, { Document } from "mongoose";

export interface IQuiz extends Document {
  _id: mongoose.ObjectId;
  title: string;
  time: number;
  category: string;
  createdBy: mongoose.ObjectId;
  updatedAt: Date;
  rating: number;
  points: number;
  difficulty: string;
  status: "draft" | "archived" | "published";
}

const quizSchema = new mongoose.Schema<IQuiz>({
  title: { type: String, minlength: 5, maxlength: 30, required: true },
  time: { type: Number, min: 1, max: 10, required: true },
  category: {
    type: String,
    required: true,
    enum: {
      values: [
        "programming",
        "history",
        "entertainment",
        "geography",
        "sports",
      ],
      message:
        "Available categories: 'programming', 'history', 'entertainment', 'geography', 'sports'.",
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
});

module.exports = mongoose.model("Quiz", quizSchema);
