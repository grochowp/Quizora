import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tickTimer } from "../../../store/quiz/quizSlice";
import { RootState } from "../../../store/store";

const QuizTimer = () => {
  const dispatch = useDispatch();
  const timer = useSelector((state: RootState) => state.quiz.timer);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        dispatch(tickTimer());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, dispatch]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <h1 className="text-xs md:text-base">
      Pozostało:{" "}
      <span className="text-extras">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </h1>
  );
};

export default QuizTimer;
