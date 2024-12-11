import { IQuestion } from "../../../interfaces";

export const Question = ({ question }: { question: IQuestion }) => {
  return (
    <>
      <h1 className="py-4 md:py-6 md:text-xl">Matematyka - mnożenie</h1>
      <div className="mb-8 flex h-fit min-h-24 w-[90%] items-center justify-center rounded-lg bg-primary px-4 py-6 text-center text-sm md:text-base">
        {question.question}
      </div>
      <div className="grid w-[90%] grid-cols-1 gap-4 md:grid-cols-2">
        {question.answers.map((answer) => (
          <div className="shadow-custom-inner flex h-fit min-h-20 cursor-pointer items-center justify-center rounded-lg border-[2px] border-transparent bg-primary px-4 py-6 text-center text-sm transition-all duration-500 last:mb-12 hover:border-extras">
            {answer}
          </div>
        ))}
      </div>
    </>
  );
};
