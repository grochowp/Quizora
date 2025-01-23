import { GrPowerReset } from "react-icons/gr";
import { useEffect, useMemo, useState } from "react";
import Spinner from "../Spinner";
import { useQuiz } from "../../../hooks/useQuiz";
import Quiz from "./Quiz";
import { motion } from "framer-motion";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { Tooltip, Zoom } from "@mui/material";

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
  limit?: number;
  styles?: string;
  pagination?: boolean;
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
  styles = "",
  pagination = false,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { loggedUserData } = useLoggedUserContext();
  const lessAnimations = loggedUserData?.userProfile?.lessAnimations;
  if (userId) query = query.concat(`${query && "&"}userId=${userId}`);

  query =
    status === "liked"
      ? query.concat("&liked=true")
      : query.concat(`&status=${status}`);

  const { quizzesLength, quizzes, error, isLoading, refetch } = useQuiz(
    query,
    currentPage,
    maxQuizzes,
  );

  const pages = Math.ceil(quizzesLength / maxQuizzes);

  const difficultyOptions = useMemo(() => ["easy", "medium", "hard"], []);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleResetQuizzes = () => {
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <article
      className={` ${quizzes.length === 0 && !isLoading && "flex flex-col items-center justify-center"}`}
    >
      <div className="flex w-full items-center justify-between">
        {!difficultyFilter && (
          <h1 className="mb-4 pl-2 font-poppins tracking-widest text-baseText md:text-xl">
            {title
              ? title
              : `Znaleziono ${quizzesLength} Quiz${quizzesLength === 1 ? "" : quizzesLength === 2 || quizzesLength === 3 ? "y" : "ów"}`}
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
                } mb-4 cursor-pointer pl-2 font-poppins tracking-widest text-baseText md:text-xl`}
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
          <Tooltip
            className="mr-4"
            title={"Odśwież"}
            placement="top"
            slots={{
              transition: Zoom,
            }}
          >
            <div className="mb-4 mr-4">
              <GrPowerReset
                className="h-5 cursor-pointer hover:animate-spin md:h-6 md:w-6"
                style={{
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "1",
                }}
                onClick={() => refetch()}
              />
            </div>
          </Tooltip>
        )}
      </div>

      <div className={styles}>
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
            className={` ${pagination && "mb-6"} flex flex-wrap gap-3`}
          >
            {quizzes.length === 0 && (
              <h1 className="flex h-[132px] items-center justify-center text-xl">
                Brak Quizów o podanych kryteriach
              </h1>
            )}
            {quizzes.map((quiz) => (
              <Quiz
                key={quiz._id}
                quiz={quiz}
                lessAnimations={lessAnimations}
                handleResetQuizzes={handleResetQuizzes}
              />
            ))}
          </motion.div>
        )}
      </div>
      {pagination && pages > 1 && (
        <div className="mb-4 flex w-full items-center justify-center gap-2 text-sm text-baseText lg:gap-4 lg:text-lg">
          <span
            className={`${currentPage === 1 ? "opacity-25" : "opacity-100"} mr-2 flex cursor-pointer items-center justify-center rounded-full border-[1px] border-baseText px-3 lg:mr-4`}
            onClick={() => handleChangePage(1)}
          >
            {"<<"}
          </span>
          <span
            className={`${currentPage <= 1 ? "pointer-events-none opacity-10" : "opacity-50"} flex w-[24px] cursor-pointer justify-center lg:w-[30px]`}
            onClick={() => handleChangePage(currentPage - 1)}
          >
            {"<"}
          </span>
          <span className="flex w-[24px] items-center justify-center rounded-full border-[1px] border-baseText lg:w-[30px]">
            {currentPage}
          </span>
          <span
            className={`${currentPage >= pages ? "pointer-events-none opacity-10" : "opacity-50"} flex w-[24px] cursor-pointer justify-center lg:w-[30px]`}
            onClick={() => handleChangePage(currentPage + 1)}
          >
            {">"}
          </span>
          <span
            className={`${currentPage === pages ? "opacity-25" : "opacity-100"} ml-2 flex cursor-pointer items-center justify-center rounded-full border-[1px] border-baseText px-3 md:ml-4`}
            onClick={() => handleChangePage(pages)}
          >
            {">>"}
          </span>
        </div>
      )}
    </article>
  );
};

export default QuizSection;
