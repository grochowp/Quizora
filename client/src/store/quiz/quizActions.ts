import { getQuizWithDetails } from "../../services/quizService";
import { AppDispatch } from "../store";
import { startQuiz } from "./quizSlice";

export const fetchQuestions =
  (quizId: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await getQuizWithDetails(quizId);
      dispatch(
        startQuiz({
          questions: response.quizDetails.questions,
          totalPoints: response.points,
          time: response.time,
        }),
      );
    } catch (error) {
      console.error("Błąd w pobieraniu pytań:", error);
    }
  };
