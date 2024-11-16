import { GrPowerReset } from "react-icons/gr";
import { useMemo, useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import { useQuiz } from "../../../hooks/useQuiz";
import Quiz from "../../../components/Quiz/Quiz";

interface IQuizSectionProps {
  title?: string;
  query: string;
  difficultyFilter?: string;
  handleDifficultyChange?: (difficulty: string) => void;
  maxQuizzes?: number;
}

const QuizSection: React.FC<IQuizSectionProps> = ({
  title,
  query,
  difficultyFilter,
  handleDifficultyChange,
  maxQuizzes = 3,
}) => {
  const [resetKey, setResetKey] = useState(0);
  const { quizzes, error, isLoading } = useQuiz(query, resetKey);
  const handleResetClick = () => {
    setResetKey((prevKey) => prevKey + 1);
  };

  const difficultyOptions = useMemo(() => ["easy", "medium", "hard"], []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <article className="mb-4">
      <div className="flex items-center justify-between">
        {title && (
          <h1 className="pl-2 font-poppins tracking-widest text-baseText md:text-xl">
            {title}
          </h1>
        )}
        {difficultyFilter && handleDifficultyChange && (
          <div className="flex gap-2">
            {difficultyOptions.map((difficulty: string) => (
              <h1
                key={difficulty}
                className={`${
                  difficultyFilter !== difficulty &&
                  "relative top-[2px] text-[16px] opacity-50"
                } cursor-pointer pl-2 font-poppins text-xl tracking-widest text-baseText`}
                onClick={() => handleDifficultyChange(difficulty)}
              >
                {difficulty === "easy"
                  ? "Łatwe"
                  : difficulty === "medium"
                    ? "Średnie"
                    : "Trudne"}
              </h1>
            ))}
          </div>
        )}
        <GrPowerReset
          className="m-4 mr-4 h-5 cursor-pointer md:h-6 md:w-6 xl:mr-4"
          onClick={handleResetClick}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: maxQuizzes }, (_, index) => (
            <div
              key={index}
              className="h-[132px] w-[300px] sm:h-[148px] sm:w-80"
            >
              <Spinner />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {quizzes.map((quiz) => (
            <Quiz key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </article>
  );
};

export default QuizSection;
