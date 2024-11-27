import { useState } from "react";
import { Button } from "../../components/reusable/elements/Button";
import CustomInput from "../../components/reusable/elements/CustomInput";
import CustomSelect from "../../components/reusable/elements/CustomSelect";
import { TileTitle } from "../../components/reusable/TileTitle";
import {
  categoryOptions,
  difficultyOptions,
  timeOptions,
} from "../../utils/selectOptions";
import { IManageQuiz, IQuestion, IQuiz } from "../../interfaces";
import { CiTrash } from "react-icons/ci";
import { useModalContext } from "../../contexts/ModalContext";
import { UpdateModal } from "../../components/reusable/modals/UpdateModal";
import { MdOutlineAddchart } from "react-icons/md";

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

const calculatePoints = (time: number, difficulty: string, length: number) => {
  console.log(difficulty);
  const difficultyModifier =
    difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  let points = Math.round((difficultyModifier * (4 + 10 / time) * length) / 3);
  points = Math.max(5, Math.min(points, 90));

  return points;
};

const ManageQuiz = ({ quiz }: { quiz?: IQuiz }) => {
  const { openModal, setIsModalOpen } = useModalContext();
  const [questions, setQuestions] = useState<IQuestion[]>(
    quiz?.quizDetails.questions || initialQuestionsState,
  );

  const [filters, setFilters] = useState({
    title: "",
    description: "",
    category: "programming",
    difficulty: "easy",
    time: "3",
  });

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const indexAnswerMap: Record<number, string> = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
  };

  const handleAddQuestion = () => {
    const newQuestions = [
      ...questions,
      { question: "", answers: ["", "", "", ""], correctAnswerIndex: 0 },
    ];

    setQuestions(newQuestions);
  };

  const handleQuestionChange = (questionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].question = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    value: string,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerIndex: number,
  ) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) =>
        i === questionIndex ? { ...q, correctAnswerIndex: answerIndex } : q,
      ),
    );
  };

  const handleDeleteQuestion = (questionIndex: number) => {
    if (questions.length > 3) {
      const updatedQuestions = questions.filter(
        (_, index) => questionIndex !== index,
      );
      setQuestions(updatedQuestions);
    } else {
      openModal(
        <UpdateModal
          label="Quiz musi się składać z minimum 3 pytań."
          icon={<MdOutlineAddchart />}
        />,
        "top",
        5,
      );
    }
  };

  const validateQuiz = (quiz: IManageQuiz) => {
    setIsModalOpen(false);
    try {
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
          if (!answer)
            throw new Error(`Brak odpowiedzi w pytaniu ${index + 1}.`);
        });
      });
    } catch (err) {
      openModal(
        <UpdateModal icon={<MdOutlineAddchart />} label={err.message} />,
        "top",
        5,
      );
    }
  };

  const handleAddQuiz = () => {
    const quiz: IManageQuiz = {
      ...filters,
      time: Number(filters.time),
      questions,
    };
    validateQuiz(quiz);
  };

  // useEffect(() => {
  //   console.log(questions);
  // }, [questions]);

  return (
    <div className="mb-8 flex w-[300px] flex-col gap-16 font-roboto lg:w-[660px] lg:flex-row lg:gap-4 xl:w-[984px] 2xl:w-[1316px]">
      <div className="inputAddQuizBox flex w-full flex-col gap-4">
        <div className="flex flex-col gap-4 rounded-lg border-l-4 border-extras bg-secondary">
          <TileTitle>Podstawowe informacje</TileTitle>
          <div className="mx-4 mb-4 flex flex-col gap-4">
            <div className="flex justify-between">
              <CustomInput
                styles="w-[266px] h-12 lg:w-[312px]"
                color="primary"
                type="text"
                label="Tytuł"
                value={filters.title}
                onChange={(value) => updateFilter("title", value)}
              />
              <Button
                styles="hidden xl:flex h-10 px-4"
                onClick={handleAddQuiz}
                type="submit"
              >
                Dodaj Quiz
              </Button>
            </div>

            <CustomInput
              color="primary"
              type="text"
              label="Opis"
              styles="h-24 w-[266px] lg:w-full xl:h-12"
              value={filters.description}
              onChange={(value) => updateFilter("description", value)}
            />
          </div>
        </div>

        {questions.map((question: IQuestion, index) => {
          return (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-lg border-l-4 border-extras bg-secondary px-4"
            >
              <div className="relative my-4 flex pb-2 after:absolute after:left-0 after:top-[115%] after:h-[1px] after:w-full after:bg-baseText after:opacity-50">
                {index + 1}.
                <input
                  type="text"
                  className="ml-2 w-full border-none bg-transparent outline-none"
                  placeholder={`Pytanie ${index + 1}`}
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                />
                <CiTrash
                  className="absolute right-0 top-0 h-6 w-6 cursor-pointer"
                  onClick={() => handleDeleteQuestion(index)}
                />
              </div>
              <div className="mb-4 grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                {question.answers.map((answer, answerIndex) => (
                  <div key={answerIndex} className="flex gap-4">
                    <CustomInput
                      label={`Odpowiedź ${indexAnswerMap[answerIndex]}`}
                      type="text"
                      color="primary"
                      value={answer}
                      styles="w-[230px] lg:w-[265px] h-12 2xl:w-[420px]"
                      onChange={(value) =>
                        handleAnswerChange(index, answerIndex, value)
                      }
                    />
                    <div className="flex items-center">
                      <input
                        id="default-checkbox"
                        type="checkbox"
                        checked={question.correctAnswerIndex === answerIndex}
                        onChange={() =>
                          handleCorrectAnswerChange(index, answerIndex)
                        }
                        className="h-5 w-5 rounded border-primary bg-primary text-extras accent-extras focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {questions.length < 15 && (
          <div className="flex flex-col gap-4 rounded-lg border-l-4 border-extras bg-secondary px-4">
            <div className="mt-4 flex">{questions.length + 1}.</div>
            <div className="mb-4 flex w-full items-center justify-center">
              <Button
                variant="outline"
                styles=" h-10 px-5"
                onClick={handleAddQuestion}
              >
                Dodaj pytanie
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="relative h-full">
        <div className="top-[144px] flex h-96 min-w-[300px] flex-col gap-7 rounded-lg border-l-4 border-extras bg-secondary lg:sticky">
          <TileTitle>Parametry</TileTitle>
          <div className="mx-4 flex w-full flex-col gap-8">
            <CustomSelect
              label="Kategoria"
              options={categoryOptions.slice(1)}
              value={filters.category}
              onChange={(value) => updateFilter("category", value)}
              color="primary"
              styles="w-[260px] h-[40px]"
            />
            <CustomSelect
              label="Poziom"
              options={difficultyOptions.slice(1)}
              value={filters.difficulty}
              onChange={(value) => updateFilter("difficulty", value)}
              color="primary"
              styles="w-[260px] h-[40px]"
            />

            <CustomSelect
              label="Czas"
              options={timeOptions}
              value={filters.time}
              onChange={(value) => updateFilter("time", value)}
              color="primary"
              styles="w-[260px] h-[40px]"
            />
          </div>

          <div className="absolute bottom-4 flex w-full justify-between px-4">
            <div className="flex flex-col justify-between">
              <span className="text-xs">
                Pytania:{" "}
                <strong className="text-extras">{questions.length}/15</strong>
              </span>
              <span className="text-xs">
                Punkty:{" "}
                <strong className="text-extras">
                  {calculatePoints(
                    Number(filters.time),
                    filters.difficulty,
                    questions.length,
                  )}
                </strong>
              </span>
            </div>

            <Button styles=" h-10 px-4" onClick={handleAddQuiz} type="submit">
              Dodaj Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageQuiz;
