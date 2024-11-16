import { useEffect, useState } from "react";
import { IQuiz } from "../interfaces";
import axios from "axios";

type CallbackFunction = () => void;

export function useQuiz(query: string, callback?: CallbackFunction) {
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    callback?.();
    const controller = new AbortController();

    async function fetchQuizzes() {
      try {
        setIsLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:3000/api/quiz${query}`,
        );

        setQuizzes(response.data.quizzes);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuizzes();

    return function () {
      controller.abort();
    };
  }, [query, callback]);

  return { quizzes, error, isLoading };
}
