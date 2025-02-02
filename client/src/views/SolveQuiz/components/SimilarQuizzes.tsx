import { useQuiz } from "../../../hooks/useQuiz";
import Quiz from "../../../components/reusable/quiz/Quiz";
import Spinner from "../../../components/reusable/Spinner";
import { Button } from "../../../components/reusable/elements/Button";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";

export const SimilarQuizzes = () => {
  const { quizzes, error, isLoading, refetch } = useQuiz("shuffle=true", 1, 3);
  const { loggedUserData } = useLoggedUserContext();
  const lessAnimations = loggedUserData?.userProfile?.lessAnimations;

  if (isLoading) return <Spinner />;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="flex flex-col gap-4">
        {quizzes.map((quiz) => (
          <Quiz
            quiz={quiz}
            handleResetQuizzes={refetch}
            lessAnimations={lessAnimations}
          />
        ))}
      </div>
      <div className="flex w-full justify-end">
        <Button onClick={() => refetch()}>Odśwież</Button>
      </div>
    </>
  );
};
