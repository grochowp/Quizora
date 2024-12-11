import { useParams } from "react-router-dom";
import { ProgressBar } from "./components/ProgressBar";
import { Button } from "../../components/reusable/elements/Button";
import { Question } from "./components/Question";
import { useState } from "react";
import { IQuestion } from "../../interfaces";
import { SideBar } from "./components/SideBar";

// TO-DO Add modal to display quiz data before going to this components, pass quiz object as a props
const SolveQuiz = () => {
  const { quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const answers = ["aaa", "babasbas", "basbsasba", "bsaasfwwadfs"];

  const question: IQuestion = {
    question: "aaaaaa",
    answers,
    correctAnswerIndex: 1,
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  };
  return (
    <div className="flex h-fit w-full flex-col items-center gap-12 text-baseText xl:flex-row xl:items-start">
      <div className="flex w-full max-w-[660px] flex-col gap-8 lg:max-w-[640px] 2xl:max-w-[900px]">
        <ProgressBar max={32} progress={12} />
        <div className="flex h-fit w-full flex-col items-center rounded-lg border-l-4 border-extras bg-secondary font-poppins">
          <Question question={question} />
          <div className="flex w-[90%] items-center justify-between py-6 pb-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-xs md:text-base">
                Pytanie:{" "}
                <span className="text-extras">{currentQuestion + 1}/32</span>
              </h1>
              <h1 className="text-xs md:text-base">
                Pozostało: <span className="text-extras">2:32 min</span>
              </h1>
            </div>
            <Button
              type="button"
              variant="fill"
              styles="py-1 px-8"
              onClick={handleNextQuestion}
            >
              Dalej
            </Button>
          </div>
        </div>
      </div>
      {quizId && <SideBar quizId={quizId} />}
    </div>
  );
};

export default SolveQuiz;
