import { useQuery } from "@tanstack/react-query";
import { IUser } from "../interfaces";
import { findUserById } from "../services/userService";

export const useUser = (userId: string | undefined) => {
  if (!userId) throw new Error("Błędny ID użytkownika.");

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<IUser>({
    queryKey: ["user", userId],
    queryFn: () => findUserById(userId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { user, error, isLoading };
}
