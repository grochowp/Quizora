import { useState } from "react";
import QuizSection from "./components/QuizSection";

const Home = () => {
  const [quizDifficulty, setQuizDifficulty] = useState<string>("easy");

  const handleDifficultyChange = async (difficulty: string) => {
    setQuizDifficulty(difficulty);
  };

  return (
    <div className="flex w-full flex-col justify-center gap-8 2xl:flex-row">
      <div className="flex max-w-[300px] flex-col sm:max-w-[320px] lg:max-w-[660px] xl:max-w-[1000px]">
        <QuizSection title="Popularne" query="" maxQuizzes={6} />
        <QuizSection
          title="Ostatnio Dodane"
          query={"?recently=true&sortBy=updatedAt"}
        />
        <QuizSection
          difficultyFilter={quizDifficulty}
          query={`?difficulty=${quizDifficulty}`}
          handleDifficultyChange={handleDifficultyChange}
        />
      </div>
      <div className="relative top-14 flex h-[300px] w-full max-w-[300px] flex-col rounded-xl border-l-4 border-extras bg-secondary shadow-md sm:max-w-[320px] lg:max-w-[650px] xl:max-w-[1000px] 2xl:w-[300px]">
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
