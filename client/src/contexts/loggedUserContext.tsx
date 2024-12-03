import React, { createContext, useState, useContext, useEffect } from "react";
import { IFormData, IUser } from "../interfaces";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { getDataFromToken, loginOrRegister } from "../services/userService";
import Cookies from "js-cookie";

interface LoggedUserContextType {
  loggedUserData: IUser | undefined;
  setLoggedUserData: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  logoutUser: () => void;
  editUser: (data: IUser) => void;
  loginUser: (data: IFormData, action: string) => void;
}

export const LoggedUserContext = createContext<
  LoggedUserContextType | undefined
>(undefined);

export const LoggedUserProvider = ({ children }: React.PropsWithChildren) => {
  const [loggedUserData, setLoggedUserData] = useState<IUser | undefined>();
  const navigate = useNavigate();

  const setUserCookie = (user: IUser) => {
    Cookies.set("userToken", JSON.stringify(user.token), {
      expires: 1 / 24,
      secure: true,
      sameSite: "None",
    });
  };

  const removeUserCookie = () => {
    Cookies.remove("userToken");
  };

  useEffect(() => {
    (async () => {
      try {
        const userToken = Cookies.get("userToken")?.replace(/^"|"$/g, "");
        if (userToken) {
          const { user } = await getDataFromToken({
            token: userToken,
          });

          setLoggedUserData(user);
        }
      } catch (error) {
        console.error("Token verification failed", error);
        setLoggedUserData(undefined);
      }
    })();
  }, []);

  const loginUser = async (data: IFormData, action: string) => {
    try {
      const response = await loginOrRegister(data, action);
      setLoggedUserData(response);
      setUserCookie(response);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data?.message || "Something went wrong");
      }
      throw new Error("An unknown error occurred");
    }
  };

  const editUser = (newUserData: IUser) => {
    setLoggedUserData(newUserData);
  };

  const logoutUser = () => {
    setLoggedUserData(undefined);
    removeUserCookie();
    navigate("/");
  };

  return (
    <LoggedUserContext.Provider
      value={{
        loggedUserData,
        setLoggedUserData,
        loginUser,
        editUser,
        logoutUser,
      }}
    >
      {children}
    </LoggedUserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoggedUserContext = () => {
  const context = useContext(LoggedUserContext);
  if (!context) {
    throw new Error(
      "useLoggedUserContext must be used within a LoggedUserProvider",
    );
  }
  return context;
};
