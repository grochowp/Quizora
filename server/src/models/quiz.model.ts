import mongoose, { Document } from "mongoose";

export interface IQuiz extends Document {
  _id: mongoose.ObjectId;
  title: string;
  time: number;
  questions: Array<{
    question: string;
    answers: Array<String>;
    correctAnswerIndex: number;
  }>;
  points: number;
  difficulty: string;
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
  questions: {
    type: [
      {
        question: { type: String, minlength: 5, maxlength: 50, required: true },
        answers: { type: [String], required: true },
        correctAnswerIndex: { type: Number, required: true },
      },
    ],
    validate: {
      validator: (questions: any[]) =>
        questions.length >= 3 && questions.length <= 15,
      message: "The quiz must have between 3 and 15 questions.",
    },
  },

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
