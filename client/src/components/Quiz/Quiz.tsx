import { BiSolidLike } from "react-icons/bi";
import { IQuiz } from "../../interfaces";

export const Quiz = ({ quiz }: { quiz: IQuiz }) => {
  return (
    <div
      className={`duration-250 font-roboto h-[148px] w-80 cursor-pointer rounded-xl border-l-4 ${quiz.difficulty === "hard" ? "border-[#DE0315]" : quiz.difficulty === "medium" ? "border-[#E2E208]" : "border-[#80E900]"} bg-secondary text-baseText transition-all hover:scale-105`}
    >
      <div className="m-3 mb-2 flex justify-between">
        <div className="relative flex gap-1">
          <h1 className="flex items-end text-xl">{quiz.title}</h1>
          <h2 className="relative bottom-[3px] flex items-end text-[10px] opacity-50">
            {quiz.points}
          </h2>
        </div>
        <div className="flex items-center rounded-md bg-extras px-2 text-[13px] text-primary">
          {quiz.questions} pytań
        </div>
      </div>
      <div>
        <p className="line-clamp-3 h-[63px] overflow-hidden text-ellipsis px-3 text-sm opacity-50">
          {quiz.description}
        </p>
      </div>
      <div className="flex justify-between px-3">
        <div className="flex items-center gap-1">
          <img
            src={quiz.user.profilePicture}
            className="h-7 w-7 rounded-full"
          />
          <span className="text-[13px]">{quiz.user.nickname}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[13px]">{quiz.rating}</span>
          <BiSolidLike className="relative bottom-[1px] text-green-500" />
        </div>
      </div>
    </div>
  );
};
