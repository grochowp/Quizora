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
  status: string;
}

const quizSchema = new mongoose.Schema<IQuiz>({
  title: { type: String, minlength: 5, maxlength: 30, required: true },
  time: { type: Number, min: 1, max: 10, required: true },
  category: {
    type: String,
    required: true,
    enum: {
      values: ["Programowanie", "Historia", "Rozrywka", "Geografia", "Sport"],
      message:
        "Dostępne kategorie: 'Programowanie', 'Historia, 'Rozrywka', 'Grografia', 'Sport'.",
    },
  },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  updatedAt: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 },
  points: {
    type: Number,
    min: 10,
    max: 50,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["Draft", "Opublikowany", "Zarchiwizowany"],
      message:
        "Status musi mieć wartość 'Draft', 'Opublikowany', lub 'Zarchiwizowany'.",
    },
    default: "Opublikowany",
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
