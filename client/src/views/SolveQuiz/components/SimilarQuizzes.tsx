import { useQuiz } from "../../../hooks/useQuiz";
import Quiz from "../../../components/reusable/quiz/Quiz";
import Spinner from "../../../components/reusable/Spinner";
import { Button } from "../../../components/reusable/elements/Button";

export const SimilarQuizzes = () => {
  const { quizzes, error, isLoading, refetch } = useQuiz("shuffle=true", 1, 3);

  if (isLoading) return <Spinner />;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="flex flex-col gap-4">
        {quizzes.map((quiz) => (
          <Quiz quiz={quiz} />
        ))}
      </div>
      <div className="flex w-full justify-end">
        <Button onClick={() => refetch()}>Odśwież</Button>
      </div>
    </>
  );
};
