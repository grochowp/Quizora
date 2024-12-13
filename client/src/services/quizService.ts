import axios from "axios";
import { IManageQuiz, IQuiz, IQuizWithNumber } from "../interfaces";
import Cookies from "js-cookie";

export const fetchQuizzesByQuery = async (
  query: string,
  page: number,
  limit: number,
): Promise<IQuizWithNumber> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_DB_URL}api/quiz?page=${page}&limit=${limit}&${query}`,
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const createQuiz = async (quizData: IManageQuiz) => {
  try {
    const token = Cookies.get("userToken");
    const cleanToken = token?.replace(/^"|"$/g, "");
    const response = await axios.post(
      `${import.meta.env.VITE_DB_URL}api/quiz/`,
      quizData,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { quiz, createdQuizzesMessage } = response.data;

    return { quiz, createdQuizzesMessage };
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const getQuizWithDetails = async (quizId: string): Promise<IQuiz> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_DB_URL}api/quiz/${quizId}`,
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};
