import axios from "axios";
import { IQuiz } from "../interfaces";

export const fetchQuizzesByQuery = async (query: string): Promise<IQuiz[]> => {
  try {
    const response = await axios.get(`http://localhost:3000/api/quiz?${query}`);
    return response.data.quizzes;
  } catch (err) {
    throw new Error(err);
  }
};
