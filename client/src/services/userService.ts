import axios from "axios";
import { IFormData, IUser } from "../interfaces";

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
    throw new Error(err);
  }
};

export const findUserById = async (userId: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_DB_URL}api/user/${userId}`,
    );
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};
