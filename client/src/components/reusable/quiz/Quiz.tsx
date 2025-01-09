import { BiSolidLike } from "react-icons/bi";
import { IQuiz } from "../../../interfaces";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { TopModal } from "../modals/TopModal";
import { useModalContext } from "../../../contexts/ModalContext";
import { getQuizWithDetails } from "../../../services/quizService";
import { MdOutlineAddchart } from "react-icons/md";

const itemVariants = {
  hidden: { y: 0, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Quiz = ({
  quiz,
  lessAnimations,
}: {
  quiz: IQuiz;
  lessAnimations?: boolean;
}) => {
  const { loggedUserData } = useLoggedUserContext();
  const { openModal } = useModalContext();
  const editButton = loggedUserData?._id === quiz.createdBy;
  const navigate = useNavigate();

  const navigateToQuiz = () => {
    navigate(`/quiz/${quiz._id}`, { state: { title: quiz.title } });
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
      variants={lessAnimations ? undefined : itemVariants}
      whileHover={lessAnimations ? undefined : { scale: 1.05, rotate: -2 }}
      className={`duration-250 relative h-[132px] w-[300px] cursor-pointer rounded-xl border-l-4 font-roboto sm:h-[148px] sm:w-80 ${quiz.difficulty === "hard" ? "border-[#DE0315]" : quiz.difficulty === "medium" ? "border-[#E2E208]" : "border-[#80E900]"} relative bg-secondary text-baseText`}
      onClick={navigateToQuiz}
    >
      {editButton && (
        <div
          className="absolute -top-2 right-4 -z-10 h-2 w-8 cursor-pointer rounded-t-md bg-extras text-xs transition-all duration-500 hover:h-8 hover:-translate-y-6"
          onClick={(e) => navigateToQuizEdit(e)}
        >
          <CiEdit className="h-8 w-8 text-primary" />
        </div>
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
