import mongoose, { Document } from "mongoose";

export interface IQuiz extends Document {
  title: string;
  time: number;
  questions: Array<{
    question: string;
    answers: Array<String>;
    correctAnswerIndex: number;
  }>;
  createdBy: {
    userId: mongoose.Types.ObjectId;
    login: string;
  };
  createdAt: Date;
  updatedAt: Date;
  // status?: 'draft' | 'published' | 'archived';
}

const quizSchema = new mongoose.Schema<IQuiz>({
  title: { type: String, minlength: 5, maxlength: 30, required: true },
  time: { type: Number, min: 1, max: 10, required: true },
  questions: [
    {
      question: { type: String, minLength: 5, maxLength: 50, required: true },
      answers: { type: [String], required: true },
      correctAnswerIndex: { type: Number, required: true },
    },
  ],
  createdBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    login: {
      type: String,
      required: true,
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  //  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }, // See later if this should be added
});

module.exports = mongoose.model("Quiz", quizSchema);
