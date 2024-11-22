import { useState } from "react";
import QuizSection from "../../components/reusable/quiz/QuizSection";

const Home = () => {
  const [quizDifficulty, setQuizDifficulty] = useState<string>("easy");
  const handleDifficultyChange = async (difficulty: string) => {
    setQuizDifficulty(difficulty);
  };

  return (
    <div className="flex flex-col justify-center gap-8 2xl:flex-row">
      <div className="flex max-w-[300px] flex-col sm:max-w-[320px] lg:max-w-[660px] xl:max-w-[1000px]">
        <QuizSection title="Popularne" query="shuffle=true" maxQuizzes={6} />
        <QuizSection
          title="Ostatnio Dodane"
          query={"recently=true&sortBy=updatedAt&shuffle=true"}
        />
        <QuizSection
          difficultyFilter={quizDifficulty}
          query={`difficulty=${quizDifficulty}&shuffle=true`}
          handleDifficultyChange={handleDifficultyChange}
        />
      </div>
      <div className="relative flex h-[300px] w-full max-w-[300px] flex-col rounded-xl border-l-4 border-extras bg-secondary shadow-md sm:max-w-[320px] lg:max-w-[650px] xl:max-w-[1000px] 2xl:top-14 2xl:w-[300px]">
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
