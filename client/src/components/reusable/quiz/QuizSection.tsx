import { GrPowerReset } from "react-icons/gr";
import { useMemo } from "react";
import Spinner from "../Spinner";
import { useQuiz } from "../../../hooks/useQuiz";
import Quiz from "./Quiz";
import { motion } from "framer-motion";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";

const containerVariants = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.075,
    },
  },
};

interface IQuizSectionProps {
  title?: string;
  query: string;
  difficultyFilter?: string;
  handleDifficultyChange?: (difficulty: string) => void;
  reset?: boolean;
  maxQuizzes?: number;
  userId?: string;
  status?: string;
}

const QuizSection: React.FC<IQuizSectionProps> = ({
  title,
  query,
  difficultyFilter,
  handleDifficultyChange,
  reset = true,
  maxQuizzes = 3,
  userId,
  status = "published",
}) => {
  const { loggedUserData } = useLoggedUserContext();
  const lessAnimations = loggedUserData?.userProfile?.lessAnimations;

  if (userId) query = query.concat(`${query && "&"}userId=${userId}`);

  query =
    status === "liked"
      ? query.concat("&liked=true")
      : query.concat(`&status=${status}`);

  const { quizzesLength, quizzes, error, isLoading, refetch } = useQuiz(query);

  const difficultyOptions = useMemo(() => ["easy", "medium", "hard"], []);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <article
      className={`${quizzes.length === 0 && !isLoading && "flex flex-col items-center justify-center"}`}
    >
      <div className="flex w-full items-center justify-between">
        {!difficultyFilter && (
          <h1 className="mb-4 pl-2 font-poppins tracking-widest text-baseText md:text-xl">
            {title ? title : `Znaleziono ${quizzesLength} Quizów.`}
          </h1>
        )}

        {difficultyFilter && handleDifficultyChange && (
          <div className="flex gap-2">
            {difficultyOptions.map((difficulty: string) => (
              <h1
                key={difficulty}
                className={`${
                  difficultyFilter !== difficulty &&
                  "relative top-[2px] text-[14px] opacity-50 md:text-[14px]"
                } cursor-pointer pl-2 font-poppins tracking-widest text-baseText md:text-xl`}
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
        {reset && (
          <GrPowerReset
            className="mb-4 mr-4 h-5 cursor-pointer md:h-6 md:w-6 xl:mr-4"
            onClick={() => refetch()}
          />
        )}
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
        <motion.div
          variants={lessAnimations ? undefined : containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3"
        >
          {quizzes.length === 0 && (
            <h1 className="flex h-[132px] items-center justify-center text-xl">
              Brak Quizów o podanych kryteriach
            </h1>
          )}
          {quizzes.slice(0, maxQuizzes).map((quiz) => (
            <Quiz key={quiz._id} quiz={quiz} lessAnimations={lessAnimations} />
          ))}
        </motion.div>
      )}
    </article>
  );
};

export default QuizSection;
