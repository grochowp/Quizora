import { useEffect, useState } from "react";
import { IQuiz } from "../interfaces";
import { fetchQuizzesByQuery } from "../services/homeService";

export function useQuiz(query: string, resetKey: number) {
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async function () {
      try {
        setIsLoading(true);

        const response = await fetchQuizzesByQuery(query);
        setQuizzes(response);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [query, resetKey]);

  return { quizzes, error, isLoading };
}
