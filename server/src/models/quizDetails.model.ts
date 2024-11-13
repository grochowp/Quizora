import mongoose, { Document } from "mongoose";

export interface IQuestion {
  question: string;
  answers: Array<string>;
  correctAnswerIndex: number;
}

export interface IQuizDetails extends Document {
  _id: mongoose.ObjectId;
  questions: Array<IQuestion>;
}

const quizDetailsSchema = new mongoose.Schema<IQuizDetails>({
  questions: {
    type: [
      {
        question: { type: String, minlength: 5, maxlength: 50, required: true },
        answers: {
          type: [String],
          required: true,
          validate: {
            validator: (answers: string[]) => answers.length === 4,
            message: "Każde pytanie wymaga dokładnie 4 odpowiedzi.", // eng
          },
        },
        correctAnswerIndex: { type: Number, required: true },
      },
    ],
    validate: {
      validator: (questions: IQuestion[]) =>
        questions.length >= 3 && questions.length <= 15,
      message: "Quiz musi zawierać od 3 do 15 pytań.", // eng
    },
  },
});

module.exports = mongoose.model("QuizDetails", quizDetailsSchema);
