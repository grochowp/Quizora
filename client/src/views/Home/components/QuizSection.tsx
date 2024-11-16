// import { IQuiz } from "../../../interfaces";
// import { Quiz } from "../../../components/Quiz/Quiz";
// import { GrPowerReset } from "react-icons/gr";
// import { useCallback, useEffect, useState } from "react";

// export const QuizSection = ({
//   quizType,
//   title,
//   callback,
//   maxQuizzes = 3,
// }: {
//   quizType: Array<IQuiz>;
//   title: string;
//   callback?: () => Promise<Array<IQuiz>>;
//   maxQuizzes?: number;
// }) => {
//   const [randomQuizzes, setRandomQuizzes] = useState<Array<IQuiz>>([]);

//   return (
//     <article className="mb-4">
//       <div className="flex items-center justify-between">
//         <h1 className="pl-2 font-poppins tracking-widest text-baseText sm:text-xl">
//           {title}
//         </h1>
//         <GrPowerReset
//           className="m-4 mr-4 h-4 cursor-pointer sm:h-6 sm:w-6 xl:mr-4"
//           onClick={shuffleQuizzes}
//         />
//       </div>
//       <div className="flex flex-wrap gap-4">
//         {randomQuizzes.map((quiz: IQuiz) => (
//           <Quiz quiz={quiz} />
//         ))}
//       </div>
//     </article>
//   );
// };

import { GrPowerReset } from "react-icons/gr";
import { IQuiz } from "../../../interfaces";
import { lazy, useCallback, useEffect, useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import { useQuiz } from "../../../hooks/useQuiz";

const Quiz = lazy(() => import("../../../components/Quiz/Quiz"));

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
  const [randomQuizzes, setRandomQuizzes] = useState<IQuiz[]>([]);
  const { quizzes, isLoading, error } = useQuiz(query);

  const shuffleQuizzes = useCallback(() => {
    const shuffledQuizzes = [...quizzes];

    for (let i = shuffledQuizzes.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledQuizzes[i], shuffledQuizzes[randomIndex]] = [
        shuffledQuizzes[randomIndex],
        shuffledQuizzes[i],
      ];
    }

    const selectedQuizzes = shuffledQuizzes.slice(0, maxQuizzes);
    setRandomQuizzes(selectedQuizzes);
  }, [quizzes, maxQuizzes]);

  useEffect(() => {
    shuffleQuizzes();
  }, [shuffleQuizzes]);

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
            {["easy", "medium", "hard"].map((difficulty) => (
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
          onClick={shuffleQuizzes}
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
          {randomQuizzes.map((quiz: IQuiz) => (
            <Quiz key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </article>
  );
};

export default QuizSection;
