import axios from "axios";
import { IManageQuiz, IQuestion, IQuiz, IQuizWithNumber } from "../interfaces";
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

export const editQuiz = async (
  quizData: Partial<IManageQuiz>,
  questions: IQuestion[],
  quizId: string,
) => {
  try {
    const token = Cookies.get("userToken")?.replace(/^"|"$/g, "");
    const response = await axios.put(
      `${import.meta.env.VITE_DB_URL}api/quiz/${quizId}`,
      { quiz: quizData, questions },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { quiz, message } = response.data;

    return { quiz, message };
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const createQuiz = async (quizData: Partial<IManageQuiz>) => {
  try {
    const token = Cookies.get("userToken")?.replace(/^"|"$/g, "");
    const response = await axios.post(
      `${import.meta.env.VITE_DB_URL}api/quiz/`,
      quizData,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
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

export const deleteQuizWithData = async (quizId: string): Promise<string> => {
  try {
    const token = Cookies.get("userToken")?.replace(/^"|"$/g, "");

    const response = await axios.delete(
      `${import.meta.env.VITE_DB_URL}api/quiz/${quizId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.message;
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
