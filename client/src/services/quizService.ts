import axios from "axios";
import { IQuiz } from "../interfaces";

export const fetchQuizzesByQuery = async (query: string): Promise<IQuiz[]> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_DB_URL}api/quiz?${query}`,
    );
    return response.data.quizzes;
  } catch (err) {
    throw new Error(err);
  }
};
