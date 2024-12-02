import { useQuery } from "@tanstack/react-query";
import { IQuizWithNumber } from "../interfaces";
import { fetchQuizzesByQuery } from "../services/quizService";

export function useQuiz(query: string) {
  const { data, error, isLoading, refetch } = useQuery<IQuizWithNumber>({
    queryKey: ["quizzes", query],
    queryFn: () => fetchQuizzesByQuery(query),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const quizzesLength = data?.quizzesLength || 0;
  const quizzes = data?.quizzes || [];

  return { quizzesLength, quizzes, error, isLoading, refetch };
}
