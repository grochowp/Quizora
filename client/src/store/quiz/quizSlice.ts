import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IQuestion } from "../../interfaces";

interface IResult {
  isCorrect: boolean;
  userAnswer: number | null;
}

interface IQuestionsRedux {
  questions: IQuestion[];
  points: number;
  totalPoints: number;
  pointsPerQuestion: number;
  results: IResult[];
  status: string;
  timer: number;
  maxTimer: number;
}

const initialState: IQuestionsRedux = {
  questions: [],
  points: 0,
  totalPoints: 0,
  pointsPerQuestion: 0,
  results: [],
  status: "idle",
  timer: 0,
  maxTimer: 0,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    startQuiz(
      state,
      action: PayloadAction<{
        questions: IQuestion[];
        totalPoints: number;
        time: number;
      }>,
    ) {
      const { questions, totalPoints, time } = action.payload;
      state.questions = questions;
      state.totalPoints = totalPoints;
      state.points = 0;
      state.pointsPerQuestion = totalPoints / questions.length;
      state.results = questions.map(() => ({
        isCorrect: false,
        userAnswer: null,
      }));
      state.status = "active";
      state.timer = time * 60;
      state.maxTimer = time * 60;
    },

    answerQuestion(
      state,
      action: PayloadAction<{ index: number; answer: number }>,
    ) {
      const { index, answer } = action.payload;
      const isCorrect = state.questions[index].correctAnswerIndex === answer;

      state.results[index] = { isCorrect, userAnswer: answer };
      if (isCorrect) {
        state.points += state.pointsPerQuestion;
      }
    },

    tickTimer(state) {
      state.timer -= 1;
      if (state.timer <= 0) {
        state.status = "finished";
      }
    },

    finishQuiz(state) {
      state.status = "finished";
    },

    resetQuiz() {
      return initialState;
    },
  },
});

export const { startQuiz, answerQuestion, tickTimer, finishQuiz, resetQuiz } =
  quizSlice.actions;

export default quizSlice.reducer;
