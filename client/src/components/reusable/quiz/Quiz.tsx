import { BiSolidLike } from "react-icons/bi";
import { IQuiz } from "../../../interfaces";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { TopModal } from "../modals/TopModal";
import { useModalContext } from "../../../contexts/ModalContext";
import {
  deleteQuizWithData,
  getQuizWithDetails,
} from "../../../services/quizService";
import { MdOutlineAddchart } from "react-icons/md";
import { PiTrashLight } from "react-icons/pi";
import { useState } from "react";
import Spinner from "../Spinner";

const itemVariants = {
  hidden: { y: 0, opacity: 0 },
  visible: (isDeleteAttempt: boolean) => {
    return { y: 0, opacity: isDeleteAttempt ? 0.25 : 1 };
  },
};

const Quiz = ({
  quiz,
  handleResetQuizzes,
  lessAnimations,
}: {
  quiz: IQuiz;
  handleResetQuizzes: () => void;
  lessAnimations?: boolean;
}) => {
  const [isDeleteAttempt, setIsDeleteAttempt] = useState<boolean>(false);
  const { loggedUserData } = useLoggedUserContext();
  const { openModal } = useModalContext();
  const loggedUserQuiz = loggedUserData?._id === quiz.createdBy;
  const navigate = useNavigate();

  const navigateToQuiz = () => {
    navigate(`/quiz/${quiz._id}`, { state: { title: quiz.title } });
  };

  // TO-DO Add modal before deleting Quiz - confirm or cancel
  const deleteQuiz = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      setIsDeleteAttempt(true);
      const message = await deleteQuizWithData(quiz._id);
      openModal(<TopModal label={message} icon={<PiTrashLight />} />, "top", 5);
      handleResetQuizzes();
    } catch (err) {
      openModal(
        <TopModal label={err.message} icon={<MdOutlineAddchart />} />,
        "top",
        5,
      );
    } finally {
      setIsDeleteAttempt(false);
    }
  };

  const navigateToQuizEdit = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      const response = await getQuizWithDetails(quiz._id);
      navigate(`/quiz/manage`, { state: { quiz: response } });
    } catch (err) {
      openModal(
        <TopModal label={err.message} icon={<MdOutlineAddchart />} />,
        "top",
        5,
      );
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      custom={isDeleteAttempt}
      whileHover={{
        scale: lessAnimations ? 1.01 : 1.05,
        rotate: lessAnimations ? 0 : -2,
      }}
      className={`${isDeleteAttempt && "pointer-events-none cursor-default opacity-25"} duration-250 group relative h-[132px] w-[300px] cursor-pointer rounded-xl border-l-4 font-roboto sm:h-[148px] sm:w-80 ${quiz.difficulty === "hard" ? "border-[#DE0315]" : quiz.difficulty === "medium" ? "border-[#E2E208]" : "border-[#80E900]"} relative bg-secondary text-baseText`}
      onClick={navigateToQuiz}
    >
      {isDeleteAttempt && (
        <div className="absolute translate-x-[140%] translate-y-[40%]">
          <Spinner />
        </div>
      )}
      {loggedUserQuiz && (
        <>
          <div
            className="absolute -top-2 right-14 -z-10 h-2 w-8 cursor-pointer rounded-t-md bg-extras text-xs opacity-0 transition-all duration-100 group-hover:h-8 group-hover:-translate-y-6 group-hover:opacity-100"
            onClick={(e) => navigateToQuizEdit(e)}
          >
            <CiEdit className="h-8 w-8 text-primary" />
          </div>
          <div
            className="absolute -top-2 right-4 -z-10 h-2 w-8 cursor-pointer rounded-t-md bg-red-500 text-xs opacity-0 group-hover:h-8 group-hover:-translate-y-6 group-hover:opacity-100"
            onClick={(e) => deleteQuiz(e)}
          >
            <PiTrashLight className="h-7 w-7 translate-x-[2.5px] translate-y-[3px] text-primary" />
          </div>
        </>
      )}
      <div className="m-3 mb-2 flex justify-between">
        <div className="relative flex gap-1">
          <h1 className="line-clamp-1 max-w-[160px] overflow-hidden text-ellipsis text-xl">
            {quiz.title}
          </h1>

          <h2 className="relative bottom-[3px] flex items-end text-[10px] opacity-50">
            {quiz.points}pkt
          </h2>
        </div>
        <div className="flex h-6 items-center rounded-md bg-extras px-2 text-xs text-primary sm:h-7 sm:text-[13px]">
          {quiz.questions} pytań
        </div>
      </div>
      <div>
        <p className="line-clamp-3 overflow-hidden text-ellipsis px-3 text-xs opacity-50 sm:h-[63px] sm:text-sm">
          {quiz.description}
        </p>
      </div>
      <div className="absolute bottom-2 flex w-full justify-between px-3">
        <div className="flex items-center gap-1">
          <img
            src={quiz.user.profilePicture}
            className="h-5 w-5 rounded-full sm:h-6 sm:w-6"
          />
          <span className="text-xs sm:text-[13px]">{quiz.user.nickname}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[13px]">{quiz.rating}</span>
          <BiSolidLike
            className={`relative bottom-[1px] ${quiz.rating >= 0 ? "text-green-500" : "rotate-180 text-red-600"}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Quiz;
