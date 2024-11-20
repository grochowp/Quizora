import axios from "axios";
import { IFormData, IUser } from "../interfaces";

export const loginOrRegister = async (
  action: string,
  body: IFormData,
): Promise<IUser> => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/user/${action}`,
      body,
    );
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};
