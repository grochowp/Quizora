import { useQuery } from "@tanstack/react-query";
import { IQuiz } from "../interfaces";
import { fetchQuizzesByQuery } from "../services/quizService";

export function useQuiz(query: string) {
  const {
    data: quizzes = [],
    error,
    isLoading,
    refetch,
  } = useQuery<IQuiz[]>({
    queryKey: ["quizzes", query],
    queryFn: () => fetchQuizzesByQuery(query),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { quizzes, error, isLoading, refetch };
}
