import { BiSolidLike } from "react-icons/bi";
import { IQuiz } from "../../interfaces";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { y: 0, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Quiz = ({ quiz }: { quiz: IQuiz }) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`duration-250 h-[132px] w-[300px] cursor-pointer rounded-xl border-l-4 font-roboto sm:h-[148px] sm:w-80 ${quiz.difficulty === "hard" ? "border-[#DE0315]" : quiz.difficulty === "medium" ? "border-[#E2E208]" : "border-[#80E900]"} bg-secondary text-baseText transition-all hover:scale-105`}
    >
      <div className="m-2 mx-3 mb-2 flex justify-between sm:m-3">
        <div className="relative flex gap-1">
          <h1 className="flex items-end text-xl">{quiz.title}</h1>
          <h2 className="relative bottom-[3px] flex items-end text-[10px] opacity-50">
            {quiz.points}pkt
          </h2>
        </div>
        <div className="flex h-6 items-center rounded-md bg-extras px-2 text-xs text-primary sm:h-7 sm:text-[13px]">
          {quiz.questions} pytań
        </div>
      </div>
      <div>
        <p className="line-clamp-3 h-14 overflow-hidden text-ellipsis px-3 text-xs opacity-50 sm:h-[63px] sm:text-sm">
          {quiz.description}
        </p>
      </div>
      <div className="flex justify-between px-3">
        <div className="flex items-center gap-1">
          <img
            src={quiz.user.profilePicture}
            className="h-5 w-5 rounded-full sm:h-6 sm:w-6"
          />
          <span className="text-xs sm:text-[13px]">{quiz.user.nickname}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[13px]">{quiz.rating}</span>
          <BiSolidLike className="relative bottom-[1px] text-green-500" />
        </div>
      </div>
    </motion.div>
  );
};

export default Quiz;
/**
 * import { BiSolidLike } from "react-icons/bi";
import { IQuiz } from "../../interfaces";

export const Quiz = ({ quiz }: { quiz: IQuiz }) => {
  return (
    <div
      className={`duration-250 h-[132px] w-72 cursor-pointer rounded-xl border-l-4 font-roboto sm:h-[148px] sm:w-80 ${quiz.difficulty === "hard" ? "border-[#DE0315]" : quiz.difficulty === "medium" ? "border-[#E2E208]" : "border-[#80E900]"} bg-secondary text-baseText transition-all hover:scale-105`}
    >
      <div className="m-2 mb-2 flex justify-between sm:m-3">
        <div className="relative flex gap-1">
          <h1 className="flex items-end text-xl">{quiz.title}</h1>
          <h2 className="relative bottom-[3px] flex items-end text-[10px] opacity-50">
            {quiz.points}pkt
          </h2>
        </div>
        <div className="flex items-center rounded-md bg-extras px-2 text-[13px] text-primary">
          {quiz.questions} pytań
        </div>
      </div>
      <div>
        <p className="line-clamp-3 h-14 overflow-hidden text-ellipsis px-3 text-xs opacity-50 sm:h-[63px] sm:text-sm">
          {quiz.description}
        </p>
      </div>
      <div className="flex justify-between px-3">
        <div className="flex items-center gap-1">
          <img
            src={quiz.user.profilePicture}
            className="h-5 w-5 rounded-full sm:h-6 sm:w-6"
          />
          <span className="text-xs sm:text-[13px]">{quiz.user.nickname}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[13px]">{quiz.rating}</span>
          <BiSolidLike className="relative bottom-[1px] text-green-500" />
        </div>
      </div>
    </div>
  );
};

 */
