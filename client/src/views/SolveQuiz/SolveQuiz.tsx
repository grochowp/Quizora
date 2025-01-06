import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TimeBar } from "./components/TimeBar";
import { Button } from "../../components/reusable/elements/Button";
import { Question } from "./components/Question";
import { useEffect, useState } from "react";
import {
  answerQuestion,
  finishQuiz,
  resetQuiz,
} from "../../store/quiz/quizSlice";
import { SideBar } from "./components/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions } from "../../store/quiz/quizActions";
import { AppDispatch, RootState } from "../../store/store";
import { useModalContext } from "../../contexts/ModalContext";
import { TopModal } from "../../components/reusable/modals/TopModal";
import { BiError } from "react-icons/bi";
import Spinner from "../../components/reusable/Spinner";

// TO-DO Add modal to display quiz data before going to this components, pass quiz object as a props
// TO-DO Add fetching title to display it in quiz
const SolveQuiz = () => {
  const { quizId } = useParams();
  const { openModal } = useModalContext();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { questions, status } = useSelector((state: RootState) => state.quiz);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!quizId) throw new Error("Błędne ID Quizu");
        await dispatch(fetchQuestions(quizId));
      } catch (err) {
        navigate("/error");
        openModal(
          <TopModal icon={<BiError />} label={err.message} />,
          "top",
          5,
        );
      }
    };

    dispatch(resetQuiz());
    fetchDetails();
  }, [quizId, dispatch, openModal, navigate]);

  const handleNextQuestion = () => {
    if (selectedAnswer === -1) {
      openModal(
        <TopModal
          icon={<BiError />}
          label="Aby przejść dalej, musisz wybrać odpowiedź."
        />,
        "top",
        3,
      );
      return;
    }
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
        <TimeBar />
        {status === "idle" && (
          <div className="flex h-full w-full justify-center">
            <Spinner />
          </div>
        )}
        {status === "active" && (
          <div className="flex h-fit w-full flex-col items-center rounded-lg border-l-4 border-extras bg-secondary font-poppins">
            <Question
              title={location.state.title}
              question={question}
              handleSelectAnswer={handleSelectAnswer}
              selectedAnswer={selectedAnswer}
            />
            <div className="flex w-[90%] items-center justify-between py-6 pb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-xs md:text-base">
                  Pytanie:{" "}
                  <span className="text-extras">
                    {currentQuestion + 1}/{questions.length}
                  </span>
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
        )}
        {status === "finished" && ""}
      </div>
      {quizId && <SideBar quizId={quizId} />}
    </div>
  );
};

export default SolveQuiz;
