import { useState } from "react";
import { IManageQuiz, IQuestion, IQuiz, IQuizFilters } from "../../interfaces";
import { useModalContext } from "../../contexts/ModalContext";
import { UpdateModal } from "../../components/reusable/modals/UpdateModal";
import { MdOutlineAddchart } from "react-icons/md";
import { GeneralInformations } from "./Components/GeneralInformations";
import { Questions } from "./Components/Questions";
import { Parameters } from "./Components/Parameters";
import FullPageSpinner from "../../components/reusable/FullPageSpinner";
import { createQuiz } from "../../services/quizService";
import { useNavigate } from "react-router-dom";

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
  const { openModal, setIsModalOpen } = useModalContext();
  const [questions, setQuestions] = useState<IQuestion[]>(
    quiz?.quizDetails.questions || initialQuestionsState,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<IQuizFilters>({
    title: "",
    description: "",
    category: "programming",
    difficulty: "easy",
    time: "3",
  });

  const navigate = useNavigate();

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const validateQuiz = (quiz: IManageQuiz) => {
    setIsModalOpen(false);

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

  const handleAddQuiz = async () => {
    let message;
    try {
      setIsLoading(true);
      const quiz: IManageQuiz = {
        ...filters,
        time: Number(filters.time),
        questions,
      };
      validateQuiz(quiz);

      const { quiz: newQuiz, createdQuizzesMessage } = await createQuiz(quiz);
      message = `Quiz "${newQuiz.title}" został utworzony \n${createdQuizzesMessage}`;
      navigate("/");
      resetFilters();
    } catch (err) {
      message = err.message;
    } finally {
      setIsLoading(false);
      openModal(
        <UpdateModal icon={<MdOutlineAddchart />} label={message} />,
        "top",
        5,
      );
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

        <Questions questions={questions} setQuestions={setQuestions} />
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
