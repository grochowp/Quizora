import axios from "axios";
import Cookies from "js-cookie";

export const fetchAchievements = async () => {
  try {
    const token = Cookies.get("userToken")?.replace(/^"|"$/g, "");
    const response = await axios.get(
      `${import.meta.env.VITE_DB_URL}api/achievement`,
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
