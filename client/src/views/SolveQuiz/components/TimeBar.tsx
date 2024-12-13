import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { tickTimer } from "../../../store/quiz/quizSlice";

export const TimeBar = memo(() => {
  const { timer, maxTimer } = useSelector((state: RootState) => state.quiz);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        dispatch(tickTimer());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, dispatch]);

  return (
    <div className="font-poppins">
      <div className="mb-3 flex justify-center text-lg md:text-2xl">
        <h1 className="">
          Pozostały czas: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </h1>
      </div>
      <div className="h-6 w-full rounded-full bg-secondary md:h-8">
        <div
          className="relative h-6 w-20 rounded-full bg-extras transition-all duration-300 md:h-8"
          style={{ width: `${(timer / maxTimer) * 100}%` }}
        >
          {/* <span className="absolute -top-[1px] right-2 font-roboto text-lg text-primary md:right-3 md:top-[2px] md:text-xl">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span> */}
        </div>
      </div>
      <div className="flex w-full justify-between font-roboto text-lg md:text-xl">
        <span className="ml-2 mt-1">0</span>
        <span className="mr-2 mt-1">{maxTimer / 60}:00</span>
      </div>
    </div>
  );
});
