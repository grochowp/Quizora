import mongoose, { Document } from "mongoose";

export interface IQuiz extends Document {
  _id: mongoose.ObjectId;
  title: string;
  time: number;
  category: string;
  createdBy: number;
  updatedAt: Date;
  rating: number;
  points: number;
  difficulty: string;
  // status?: 'draft' | 'published' | 'archived';
}

const quizSchema = new mongoose.Schema<IQuiz>({
  title: { type: String, minlength: 5, maxlength: 30, required: true },
  time: { type: Number, min: 1, max: 10, required: true },
  category: { type: String, required: true, enum: { values: ["", ""] } },
  createdBy: { type: Number, required: true },
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
  //  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }, // See later if this should be added
});

module.exports = mongoose.model("Quiz", quizSchema);
