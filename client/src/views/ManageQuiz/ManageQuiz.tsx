import { useState } from "react";
import {
  IManageQuiz,
  IQuestion,
  IQuiz,
  IQuizFilters,
  ITopModalBody,
} from "../../interfaces";
import { useModalContext } from "../../contexts/ModalContext";
import { MdOutlineAddchart } from "react-icons/md";
import { GeneralInformations } from "./Components/GeneralInformations";
import { Questions } from "./Components/Questions";
import { Parameters } from "./Components/Parameters";
import FullPageSpinner from "../../components/reusable/FullPageSpinner";
import { createQuiz } from "../../services/quizService";
import { useNavigate } from "react-router-dom";
import { TopModal } from "../../components/reusable/modals/TopModal";
import { BiError } from "react-icons/bi";

const initialQuestionsState = [
  {
    question: "",
    answers: ["", "", "", ""],
    correctAnswerIndex: 0,
  },

  {
    question: "",
    answers: ["", "", "", ""],
    correctAnswerIndex: 0,
  },

  {
    question: "",
    answers: ["", "", "", ""],
    correctAnswerIndex: 0,
  },
];

const ManageQuiz = ({ quiz }: { quiz?: IQuiz }) => {
  const { openModal, closeAllModals } = useModalContext();
  const [questions, setQuestions] = useState<IQuestion[]>(
    quiz?.quizDetails.questions || initialQuestionsState,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<IQuizFilters>({
    title: quiz?.title || "",
    description: quiz?.description || "",
    category: quiz?.category || "programming",
    difficulty: quiz?.difficulty || "easy",
    time: String(quiz?.time) || "3",
  });

  const modals: ITopModalBody[] = [];

  const navigate = useNavigate();

  const handleSetQuestions = (newQuestions: IQuestion[]) => {
    setQuestions(newQuestions);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const validateQuiz = (quiz: IManageQuiz) => {
    closeAllModals();

    if (!quiz.title || !quiz.description) {
      throw new Error("Wprowadź podstawowe informacje o Quizie.");
    }

    quiz.questions.map((question, index) => {
      if (
        !question.question ||
        question.correctAnswerIndex < 0 ||
        question.correctAnswerIndex > 4
      ) {
        throw new Error(`Pytanie ${index + 1} zawiera niepoprawne dane.`);
      }

      question.answers.map((answer) => {
        if (!answer) throw new Error(`Brak odpowiedzi w pytaniu ${index + 1}.`);
      });
    });
  };

  const resetFilters = () => {
    setQuestions(initialQuestionsState);
    setFilters({
      title: "",
      description: "",
      category: "programming",
      difficulty: "easy",
      time: "3",
    });
  };

  const addModal = (label: string, icon: React.ReactNode, time: number) => {
    modals.push({ label, icon, time });
  };

  const handleAddQuiz = async () => {
    try {
      setIsLoading(true);
      const quiz: IManageQuiz = {
        ...filters,
        time: Number(filters.time),
        questions,
      };
      validateQuiz(quiz);

      const { quiz: newQuiz, createdQuizzesMessage } = await createQuiz(quiz);
      addModal(
        `Quiz "${newQuiz.title}" został dodany`,
        <MdOutlineAddchart />,
        7,
      );
      addModal(createdQuizzesMessage, <MdOutlineAddchart />, 5);

      navigate("/");
      resetFilters();
    } catch (err) {
      addModal(err.message, <BiError />, 5);
    } finally {
      setIsLoading(false);

      modals.forEach((modal) => {
        openModal(
          <TopModal icon={modal.icon} label={modal.label} />,
          "top",
          modal.time,
        );
      });
    }
  };

  return (
    <div
      className={` ${isLoading && "pointer-events-none opacity-50"} relative mb-8 flex w-[300px] flex-col gap-16 font-roboto lg:w-[660px] lg:flex-row lg:gap-4 xl:w-[984px] 2xl:w-[1316px]`}
    >
      {isLoading && <FullPageSpinner />}

      <div className={`inputAddQuizBox relative flex w-full flex-col gap-4`}>
        <GeneralInformations
          filters={filters}
          handleAddQuiz={handleAddQuiz}
          updateFilter={updateFilter}
        />

        <Questions
          questions={questions}
          handleSetQuestions={handleSetQuestions}
        />
      </div>
      <Parameters
        filters={filters}
        handleAddQuiz={handleAddQuiz}
        updateFilter={updateFilter}
        questionsLength={questions.length}
      />
    </div>
  );
};

export default ManageQuiz;
