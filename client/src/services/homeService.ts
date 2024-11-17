import axios from "axios";
import { IQuiz } from "../interfaces";

export const fetchQuizzesByQuery = async (query: string): Promise<[IQuiz]> => {
  const response = await axios.get(`http://localhost:3000/api/quiz?${query}`);
  return response.data.quizzes;
};
