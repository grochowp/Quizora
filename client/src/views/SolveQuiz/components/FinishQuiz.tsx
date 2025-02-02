import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { finishQuizAndAssignPoints } from "../../../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import { TopModal } from "../../../components/reusable/modals/TopModal";
import { useModalContext } from "../../../contexts/ModalContext";
import { CiTrophy } from "react-icons/ci";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { BiSolidLike } from "react-icons/bi";
import { Button } from "../../../components/reusable/elements/Button";
import {
  checkIfQuizIsRatedByUser,
  rateQuiz,
} from "../../../services/ratingService";
import { resetQuiz } from "../../../store/quiz/quizSlice";

export const FinishQuiz = ({ title }: { title: string }) => {
  const { openModal } = useModalContext();
  const { resetUserData, loggedUserData } = useLoggedUserContext();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { timer, points, totalPoints } = useSelector(
    (state: RootState) => state.quiz,
  );
  const dispatch = useDispatch<AppDispatch>();

  const gainedPoints = Math.round(points);
  const timePoints = Math.round(Math.min(10, timer / 50));
  const perfectQuiz = points === totalPoints;
  const [userRating, setUserRating] = useState<number>(0);
  const allGainedPoints = perfectQuiz
    ? Math.round((gainedPoints + timePoints) * 1.25)
    : gainedPoints + timePoints;

  useEffect(() => {
    const finishQuiz = async (quizId: string, points: number) => {
      try {
        const isRated = await checkIfQuizIsRatedByUser(quizId);
        setUserRating(isRated);
        const response = await finishQuizAndAssignPoints(quizId, points);
        openModal(
          <TopModal icon={<CiTrophy />} label={response.finishQuizMessage} />,
          "top",
          5,
        );
        openModal(
          <TopModal icon={<CiTrophy />} label={response.addPointsMessage} />,
          "top",
          5,
        );
        resetUserData();
      } catch (err) {
        throw new Error(`Błąd w zakończeniu quizu: ${err.message}`);
      }
    };

    finishQuiz(quizId!, allGainedPoints);
  }, [quizId, allGainedPoints, openModal, resetUserData]);

  const handleRateQuiz = async (rating: number) => {
    try {
      await rateQuiz(quizId!, rating);
      const isRated = await checkIfQuizIsRatedByUser(quizId!);
      setUserRating(isRated);
    } catch (err) {
      throw new Error(`Błąd w pobieraniu pytań: ${err.message}`);
    }
  };

  const finishQuiz = () => {
    navigate("/");
    dispatch(resetQuiz());
  };

  return (
    <>
      <h1 className="py-4 md:py-6 md:text-xl">{title}</h1>
      <div className="mb-8 flex h-fit min-h-24 w-[90%] flex-col items-start gap-4 rounded-lg bg-primary px-4 py-6 text-center md:text-base">
        <span className="text-lg">
          Punkty za poprawne odpowiedzi:{" "}
          <strong className="text-extras">+{gainedPoints} pkt</strong>
        </span>

        <span className="text-lg">
          Bonus za pozostały czas:{" "}
          <strong className="text-extras">+{timePoints} pkt</strong>
        </span>

        <span
          className={`${perfectQuiz || "line-through opacity-25"} relative text-lg after:absolute after:left-0 after:top-[175%] after:h-[1px] after:w-full after:bg-baseText after:opacity-50`}
        >
          Bonus za perfekcyjny quiz:{" "}
          <strong className="text-extras">+25% pkt</strong>
        </span>

        <span className="mt-6 text-lg">
          Całkowite uzyskane punkty:{" "}
          <strong className="text-extras">{allGainedPoints}</strong>
        </span>
      </div>

      <div className="flex w-full items-center justify-between px-12 pb-4">
        <div className="flex flex-col items-center">
          <span>Oceń Quiz</span>
          <div className="flex gap-4 rounded-lg bg-primary px-2 py-1">
            <BiSolidLike
              className={`${userRating === 1 || "grayscale-[75]"} h-10 w-10 cursor-pointer text-green-500`}
              onClick={() => handleRateQuiz(1)}
            />
            <BiSolidLike
              className={`${userRating === -1 || "grayscale-[75]"} h-10 w-10 rotate-180 cursor-pointer text-red-600`}
              onClick={() => handleRateQuiz(-1)}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span>
            Twoje punkty:{" "}
            <strong className="text-extras">{loggedUserData?.points}</strong>
          </span>
          <Button onClick={finishQuiz}>Kontynuuj</Button>
        </div>
      </div>
    </>
  );
};
