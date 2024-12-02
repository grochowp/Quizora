import axios from "axios";
import { IManageQuiz, IQuizWithNumber } from "../interfaces";
import Cookies from "js-cookie";

export const fetchQuizzesByQuery = async (
  query: string,
): Promise<IQuizWithNumber> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_DB_URL}api/quiz?${query}`,
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
