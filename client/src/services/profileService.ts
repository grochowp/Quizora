import axios from "axios";
import { LoaderFunctionArgs } from "react-router-dom";

export const profileLoader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { userId } = params;
    const response = await axios.get(
      `http://localhost:3000/api/user/${userId}`,
    );
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};
