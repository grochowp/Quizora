import { GrPowerReset } from "react-icons/gr";
import { useMemo, useState } from "react";
import Spinner from "./Spinner";
import { useQuiz } from "../../hooks/useQuiz";
import Quiz from "./Quiz";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
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
}

const QuizSection: React.FC<IQuizSectionProps> = ({
  title,
  query,
  difficultyFilter,
  handleDifficultyChange,
  reset = true,
  maxQuizzes = 3,
  userId,
}) => {
  const [resetKey, setResetKey] = useState(0);
  if (userId) query = query.concat(`${query && "&"}userId=${userId}`);
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
            className="m-4 mr-4 h-5 cursor-pointer md:h-6 md:w-6 xl:mr-4"
            onClick={handleResetClick}
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3"
        >
          {quizzes.length === 0 && (
            <h1 className="text-xl">Brak Quizów o podanych kryteriach</h1>
          )}
          {quizzes.slice(0, maxQuizzes).map((quiz) => (
            <Quiz key={quiz._id} quiz={quiz} />
          ))}
        </motion.div>
      )}
    </article>
  );
};

export default QuizSection;
