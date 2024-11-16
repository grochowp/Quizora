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
import { Quiz } from "../../../components/Quiz/Quiz";
import { useCallback, useEffect, useState } from "react";

interface IQuizSectionProps {
  title?: string;
  quizzes: IQuiz[];
  difficultyFilter?: string;
  handleDifficultyChange?: (difficulty: string) => void;
  maxQuizzes?: number;
}

export const QuizSection: React.FC<IQuizSectionProps> = ({
  title,
  quizzes,
  difficultyFilter,
  handleDifficultyChange,
  maxQuizzes = 3,
}) => {
  const [randomQuizzes, setRandomQuizzes] = useState<IQuiz[]>([]);
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
          <h1 className="pl-2 font-poppins tracking-widest text-baseText sm:text-xl">
            {title}
          </h1>
        )}
        {difficultyFilter && handleDifficultyChange && (
          <div className="flex gap-2">
            {["easy", "medium", "hard"].map((difficulty) => (
              <h1
                key={difficulty}
                className={`${
                  difficultyFilter !== difficulty && "opacity-50"
                } cursor-pointer pl-2 font-poppins tracking-widest text-baseText sm:text-xl`}
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
          className="m-4 mr-4 h-4 cursor-pointer sm:h-6 sm:w-6 xl:mr-4"
          onClick={shuffleQuizzes}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {randomQuizzes.map((quiz: IQuiz) => (
          <Quiz key={quiz._id} quiz={quiz} />
        ))}
      </div>
    </article>
  );
};
