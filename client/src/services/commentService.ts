import axios from "axios";
import { IComment } from "../interfaces";
import Cookies from "js-cookie";

export const fetchComments = async (query: string): Promise<IComment[]> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_DB_URL}api/comment?${query}`,
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const addComment = async (body: Partial<IComment>) => {
  try {
    const token = Cookies.get("userToken")?.replace(/^"|"$/g, "");
    const response = await axios.post(
      `${import.meta.env.VITE_DB_URL}api/comment`,
      body,
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
