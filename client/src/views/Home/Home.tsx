import { useState } from "react";
import QuizSection from "../../components/reusable/quiz/QuizSection";

const Home = () => {
  const [quizDifficulty, setQuizDifficulty] = useState<string>("easy");
  const handleDifficultyChange = async (difficulty: string) => {
    setQuizDifficulty(difficulty);
  };

  return (
    <div className="flex max-w-[300px] flex-col sm:max-w-[320px] lg:max-w-[660px] xl:max-w-[1000px] 2xl:gap-4">
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
  );
};

export default Home;
