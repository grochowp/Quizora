import axios from "axios";
import { IQuiz } from "../interfaces";

export const popularQuizzesLoader = async (): Promise<[IQuiz]> => {
  const response = await axios.get(
    `http://localhost:3000/api/quiz?popular=true`,
  );
  return response.data.quizzes;
};

export const recentlyQuizzesLoader = async (): Promise<[IQuiz]> => {
  const response = await axios.get(
    `http://localhost:3000/api/quiz?recently=true&sortBy=updatedAt`,
  );
  return response.data.quizzes;
};

export const difficultyQuizzesLoader = async (
  difficultyLevel?: string,
): Promise<[IQuiz]> => {
  const difficulty = difficultyLevel || "easy";
  const response = await axios.get(
    `http://localhost:3000/api/quiz?difficulty=${difficulty}`,
  );
  return response.data.quizzes;
};

export const homeLoader = async (difficultyLevel?: string) => {
  const [popularQuizzes, recentlyQuizzes, difficultyQuizzes] =
    await Promise.all([
      popularQuizzesLoader(),
      recentlyQuizzesLoader(),
      difficultyQuizzesLoader(difficultyLevel),
    ]);

  console.log(popularQuizzes, recentlyQuizzes, difficultyQuizzes);

  return { popularQuizzes, recentlyQuizzes, difficultyQuizzes };
};
