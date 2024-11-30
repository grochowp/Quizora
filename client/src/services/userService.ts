import axios from "axios";
import { IFormData, IUser } from "../interfaces";
import Cookies from "js-cookie";
axios.defaults.withCredentials = true;

export const loginOrRegister = async (
  body: IFormData,
  action: string,
): Promise<IUser> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_DB_URL}api/user/${action}`,
      body,
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const findUserById = async (userId: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_DB_URL}api/user/${userId}`,
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

export const UpdatePreferences = async (preferences: {
  [key: string]: boolean | string;
}) => {
  try {
    const token = Cookies.get("userToken");
    const cleanToken = token?.replace(/^"|"$/g, "");
    const response = await axios.patch(
      `${import.meta.env.VITE_DB_URL}api/user/preferences`,
      preferences,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};
