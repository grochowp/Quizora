import { useEffect, useState } from "react";
import { IQuiz } from "../interfaces";
import axios from "axios";

export function useQuiz(query: string, resetKey: number) {
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async function () {
      console.log(query, resetKey);
      try {
        setIsLoading(true);
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
    })();
  }, [query, resetKey]);

  return { quizzes, error, isLoading };
}
