import { useParams } from "react-router-dom";
import { ProgressBar } from "./components/ProgressBar";
import { Button } from "../../components/reusable/elements/Button";
import { Question } from "./components/Question";
import { useEffect, useState } from "react";
import { answerQuestion, finishQuiz } from "../../store/quiz/quizSlice";
import { SideBar } from "./components/SideBar";
import Timer from "./components/Timer";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions } from "../../store/quiz/quizActions";
import { AppDispatch, RootState } from "../../store/store";

// TO-DO Add modal to display quiz data before going to this components, pass quiz object as a props
const SolveQuiz = () => {
  const { quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const dispatch = useDispatch<AppDispatch>();
  const { questions, points, totalPoints, status } = useSelector(
    (state: RootState) => state.quiz,
  );
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!quizId) throw new Error("Błędne ID Quizu");
        dispatch(fetchQuestions(quizId));
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchDetails();
  }, [quizId, dispatch]);

  const handleNextQuestion = () => {
    setSelectedAnswer(-1);
    dispatch(
      answerQuestion({ index: currentQuestion, answer: selectedAnswer }),
    );
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      dispatch(finishQuiz());
    }
  };

  const handleSelectAnswer = (answer: number) => {
    setSelectedAnswer(answer);
  };

  const question = questions[currentQuestion];

  return (
    <div className="flex h-fit w-full flex-col items-center gap-12 text-baseText xl:flex-row xl:items-start">
      <div className="flex w-full max-w-[660px] flex-col gap-8 lg:max-w-[640px] 2xl:max-w-[900px]">
        <ProgressBar max={totalPoints} progress={points} />
        {status === "idle" && "aaa"}
        {status === "active" && (
          <div className="flex h-fit w-full flex-col items-center rounded-lg border-l-4 border-extras bg-secondary font-poppins">
            <Question
              question={question}
              handleSelectAnswer={handleSelectAnswer}
              selectedAnswer={selectedAnswer}
            />
            <div className="flex w-[90%] items-center justify-between py-6 pb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-xs md:text-base">
                  Pytanie:{" "}
                  <span className="text-extras">{currentQuestion + 1}/32</span>
                </h1>
                <Timer />
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
        )}
        {status === "finished" && ""}
      </div>
      {quizId && <SideBar quizId={quizId} />}
    </div>
  );
};

export default SolveQuiz;
