import axios from "axios";
import Cookies from "js-cookie";

export const rateQuiz = async (quizId: string, rating: number) => {
  try {
    const token = Cookies.get("userToken")?.replace(/^"|"$/g, "");
    const response = await axios.post(
      `${import.meta.env.VITE_DB_URL}api/rating`,
      { quizId, rating },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const checkIfQuizIsRatedByUser = async (quizId: string) => {
  try {
    const token = Cookies.get("userToken")?.replace(/^"|"$/g, "");
    const response = await axios.get(
      `${import.meta.env.VITE_DB_URL}api/rating/${quizId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};
