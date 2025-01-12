import { useState } from "react";
import {
  IManageQuiz,
  IQuestion,
  IQuizFilters,
  ITopModalBody,
} from "../../interfaces";
import { useModalContext } from "../../contexts/ModalContext";
import { MdOutlineAddchart } from "react-icons/md";
import { GeneralInformations } from "./Components/GeneralInformations";
import { Questions } from "./Components/Questions";
import { Parameters } from "./Components/Parameters";
import FullPageSpinner from "../../components/reusable/FullPageSpinner";
import { createQuiz, editQuiz } from "../../services/quizService";
import { useLocation, useNavigate } from "react-router-dom";
import { TopModal } from "../../components/reusable/modals/TopModal";
import { BiError } from "react-icons/bi";
import { useLoggedUserContext } from "../../contexts/LoggedUserContext";

const ManageQuiz = () => {
  const location = useLocation();
  const quiz = location.state?.quiz;
  const action = quiz ? "Edytuj Quiz" : "Dodaj Quiz";
  const { openModal, closeAllModals } = useModalContext();
  const { resetUserData } = useLoggedUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<IQuestion[]>(
    quiz?.quizDetails.questions || [],
  );
  const [filters, setFilters] = useState<IQuizFilters>({
    title: quiz?.title || "",
    description: quiz?.description || "",
    category: quiz?.category || "programming",
    difficulty: quiz?.difficulty || "easy",
    time: quiz?.time || 3,
  });

  const modals: ITopModalBody[] = [];

  const navigate = useNavigate();

  const handleSetQuestions = (newQuestions: IQuestion[]) => {
    setQuestions(newQuestions);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const validateQuiz = (quiz: Partial<IManageQuiz>) => {
    closeAllModals();

    if (!quiz.title || !quiz.description) {
      throw new Error("Wprowadź podstawowe informacje o Quizie.");
    }

    quiz.questions?.map((question, index) => {
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
    setQuestions(quiz?.quizDetails.questions || []);
    setFilters({
      title: quiz?.title || "",
      description: quiz?.description || "",
      category: quiz?.category || "programming",
      difficulty: quiz?.difficulty || "easy",
      time: quiz?.time || 3,
    });
  };

  const addModal = (label: string, icon: React.ReactNode, time: number) => {
    modals.push({ label, icon, time });
  };

  const handleManageQuiz = async () => {
    try {
      setIsLoading(true);
      const quizData: Partial<IManageQuiz> = {
        ...filters,
        time: Number(filters.time),
        questions,
      };
      validateQuiz(quizData);

      if (quiz) {
        const { message } = await editQuiz(filters, questions, quiz._id!);
        addModal(message, <MdOutlineAddchart />, 7);
      } else {
        const { quiz: newQuiz, createdQuizzesMessage } =
          await createQuiz(quizData);
        resetUserData();
        addModal(
          `Quiz "${newQuiz.title}" został dodany`,
          <MdOutlineAddchart />,
          7,
        );
        addModal(createdQuizzesMessage, <MdOutlineAddchart />, 5);
      }

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
          handleManageQuiz={handleManageQuiz}
          resetFilters={resetFilters}
          updateFilter={updateFilter}
          action={action}
        />

        <Questions
          questions={questions}
          handleSetQuestions={handleSetQuestions}
        />
      </div>
      <Parameters
        filters={filters}
        handleManageQuiz={handleManageQuiz}
        updateFilter={updateFilter}
        questionsLength={questions.length}
        action={action}
      />
    </div>
  );
};

export default ManageQuiz;
