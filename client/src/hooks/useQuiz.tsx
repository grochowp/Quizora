import { useQuery } from "@tanstack/react-query";
import { IQuizWithNumber } from "../interfaces";
import { fetchQuizzesByQuery } from "../services/quizService";

export const useQuiz = (query: string, page: number, limit: number) => {
  const { data, error, isLoading, refetch } = useQuery<IQuizWithNumber>({
    queryKey: ["quizzes", query],
    queryFn: () => fetchQuizzesByQuery(query, page, limit),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const quizzesLength = data?.quizzesLength || 0;
  const quizzes = data?.quizzes || [];

  return { quizzesLength, quizzes, error, isLoading, refetch };
};
