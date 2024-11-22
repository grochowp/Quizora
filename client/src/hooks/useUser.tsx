import { useEffect, useState } from "react";
import { IUser } from "../interfaces";
import { findUserById } from "../services/userService";

export function useUser(userId: string | undefined) {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async function () {
      if (!userId) throw new Error("Błędny ID użytkownika.");
      try {
        setIsLoading(true);
        const response = await findUserById(userId);
        setUser(response);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId]);

  return { user, error, isLoading };
}
