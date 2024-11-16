import { IQuiz } from "../../interfaces";

import { difficultyQuizzesLoader, homeLoader } from "../../loaders/homeLoader";
import { QuizSection } from "./components/QuizSection";
import { useEffect, useState } from "react";

const Home = () => {
  const [quizDifficulty, setQuizDifficulty] = useState<string>("easy");
  const [popularQuizzes, setPopularQuizzes] = useState<Array<IQuiz>>([]);
  const [recentlyQuizzes, setRecentlyQuizzes] = useState<Array<IQuiz>>([]);
  const [difficultyQuizzes, setDifficultyQuizzes] = useState<Array<IQuiz>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { popularQuizzes, recentlyQuizzes, difficultyQuizzes } =
          await homeLoader();
        setPopularQuizzes(popularQuizzes);
        setRecentlyQuizzes(recentlyQuizzes);
        setDifficultyQuizzes(difficultyQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes", error);
      }
    };

    fetchData();
  }, []);

  const handleDifficultyChange = async (difficulty: string) => {
    setQuizDifficulty(difficulty);
    const quizzes = await difficultyQuizzesLoader(difficulty);
    setDifficultyQuizzes(quizzes);
  };

  return (
    <div className="flex w-full flex-col justify-center gap-8 2xl:flex-row">
      <div className="flex max-w-[300px] flex-col sm:max-w-[320px] lg:max-w-[660px] xl:max-w-[1000px]">
        <QuizSection
          title="Popularne"
          quizzes={popularQuizzes}
          maxQuizzes={6}
        />
        <QuizSection title="Ostatnio Dodane" quizzes={recentlyQuizzes} />
        <QuizSection
          quizzes={difficultyQuizzes}
          difficultyFilter={quizDifficulty}
          handleDifficultyChange={handleDifficultyChange}
        />
      </div>
      <div className="flex h-[300px] w-full max-w-[320px] flex-col rounded-xl border-l-4 border-extras bg-secondary shadow-md lg:max-w-[600px] xl:max-w-[1000px] 2xl:w-[300px]">
        <div className="p-4">
          <p className="text-center text-white">
            Tutaj może być dodatkowa treść lub widget.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
