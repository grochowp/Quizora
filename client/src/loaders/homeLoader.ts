import axios from "axios";
import { LoaderFunctionArgs } from "react-router-dom";

export const popularQuizzesLoader = async () => {
  const response = await axios.get(
    `http://localhost:3000/api/quiz?popular=true`,
  );
  return response.data.quizzes;
};

export const recentlyQuizzesLoader = async () => {
  const response = await axios.get(
    `http://localhost:3000/api/quiz?recently=true`,
  );
  return response.data.quizzes;
};

export const difficultyQuizzesLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const difficulty = params.difficulty || "easy";
  const response = await axios.get(
    `http://localhost:3000/api/quiz?difficulty=${difficulty}`,
  );
  return response.data.quizzes;
};

export const homeLoader = async (args: LoaderFunctionArgs) => {
  const [popular, recently, difficulty] = await Promise.all([
    popularQuizzesLoader(),
    recentlyQuizzesLoader(),
    difficultyQuizzesLoader(args),
  ]);

  console.log(popular, recently, difficulty);

  return { popular, recently, difficulty };
};
