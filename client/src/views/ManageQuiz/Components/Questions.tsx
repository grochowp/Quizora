import React from "react";
import { IQuestion } from "../../../interfaces";
import CustomInput from "../../../components/reusable/elements/CustomInput";
import { CiTrash } from "react-icons/ci";
import { useModalContext } from "../../../contexts/ModalContext";
import { MdOutlineAddchart } from "react-icons/md";
import { Button } from "../../../components/reusable/elements/Button";
import { TopModal } from "../../../components/reusable/modals/TopModal";

const indexAnswerMap: Record<number, string> = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
};

export const Questions = ({
  questions,
  setQuestions,
}: {
  questions: IQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<IQuestion[]>>;
}) => {
  const { openModal } = useModalContext();

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

  const handleAddQuestion = () => {
    const newQuestions = [
      ...questions,
      { question: "", answers: ["", "", "", ""], correctAnswerIndex: 0 },
    ];

    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (questionIndex: number) => {
    if (questions.length > 3) {
      const updatedQuestions = questions.filter(
        (_, index) => questionIndex !== index,
      );
      setQuestions(updatedQuestions);
    } else {
      openModal(
        <TopModal
          label="Quiz musi się składać z minimum 3 pytań."
          icon={<MdOutlineAddchart />}
        />,
        "top",
        5,
      );
    }
  };

  return (
    <>
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
                    styles="w-[230px] lg:w-[254px] h-12 2xl:w-[420px]"
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
    </>
  );
};
