import { Button } from "../../components/reusable/Button";
import QuizSection from "../../components/reusable/QuizSection";
import CustomInput from "../../components/reusable/CustomInput";
import { useState } from "react";
import CustomSelect from "../../components/reusable/CustomSelect";
import {
  categoryOptions,
  difficultyOptions,
  orderOptions,
  questionCountOptions,
} from "../../utils/selectOptions";

const Quizzes = () => {
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [questionsNumber, setQuestionsNumber] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const handleReset = () => {
    setTitle("");
    setCategory("");
    setDifficulty("");
    setQuestionsNumber("");
    setSortBy("");
    setOrder("");
    setQuery("");
  };

  const handleUpdate = () => {
    setQuery(
      `title=${title}&category=${category}&difficulty=${difficulty}&questionsCount=${questionsNumber}&sortBy=${sortBy}&order=${order}`,
    );
  };

  const handleSortChange = (value: string) => {
    setSortBy(value.split(" ")[0]);
    setOrder(value.split(" ")[1]);
  };

  return (
    <div className="flex max-w-[1600px] flex-col gap-16 font-poppins text-baseText">
      <section className="flex w-[300px] flex-col items-center justify-between gap-12 sm:w-[320px] lg:w-[660px] xl:w-[984px] xl:flex-row 2xl:w-[1316px]">
        <article className="inputBox flex flex-wrap justify-center gap-6 lg:justify-normal">
          <CustomInput
            styles="h-12 w-[276px] lg:w-[300px]"
            label="Nazwa"
            type="text"
            value={title}
            onChange={setTitle}
          />

          <CustomSelect
            label="Kategoria"
            value={category}
            options={categoryOptions}
            onChange={setCategory}
          />
          <CustomSelect
            label="Poziom"
            value={difficulty}
            options={difficultyOptions}
            onChange={setDifficulty}
          />
          <CustomSelect
            label="Ilość pytań"
            value={questionsNumber}
            options={questionCountOptions}
            onChange={setQuestionsNumber}
          />
          <CustomSelect
            label="Sortuj według"
            value={`${sortBy} ${order}`}
            options={orderOptions}
            onChange={handleSortChange}
          />
        </article>
        <article className="flex max-h-10 gap-4">
          <Button onClick={handleReset} styles="px-6 " variant="outline">
            Reset
          </Button>
          <Button onClick={handleUpdate} styles="px-8" variant="fill">
            Szukaj
          </Button>
        </article>
      </section>

      <div className="flex max-w-[300px] flex-col items-center sm:max-w-[320px] lg:max-w-[660px] xl:max-w-[984px] 2xl:max-w-[1316px]">
        <QuizSection reset={false} query={query} maxQuizzes={20} />
      </div>
    </div>
  );
};

export default Quizzes;

// <div className="relative flex flex-col">
//             <span className="absolute -top-5 left-3 text-[12px] opacity-50">
//               Kategoria
//             </span>
//             <select
//               className="shadow-custom-inner h-12 w-max rounded-md bg-secondary px-2 text-sm"
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <option value="">Dowolna</option>
//               <option value="programming">Programowanie</option>
//               <option value="history">Historia</option>
//               <option value="entertainment">Rozrywka</option>
//               <option value="geography">Geografia</option>
//               <option value="sport">Sport</option>
//             </select>
//           </div>

//           <div className="relative flex flex-col">
//             <span className="absolute -top-5 left-3 text-[12px] opacity-50">
//               Poziom
//             </span>
//             <select
//               className="shadow-custom-inner h-12 w-max rounded-md bg-secondary px-2 text-sm"
//               onChange={(e) => setDifficulty(e.target.value)}
//             >
//               <option value="">Dowolny</option>
//               <option value="easy">Łatwy</option>
//               <option value="medium">Średni</option>
//               <option value="hard">Trudny</option>
//             </select>
//           </div>
//           <div className="relative flex flex-col">
//             <span className="absolute -top-5 left-3 text-[12px] opacity-50">
//               Ilość pytań
//             </span>
//             <select
//               className="shadow-custom-inner h-12 w-max rounded-md bg-secondary px-2 text-sm"
//               onChange={(e) => setQuestionsNumber(e.target.value)}
//             >
//               <option value="">Dowolna</option>
//               {Array.from({ length: 13 }, (_, index) => (
//                 <option
//                   value={index + 3}
//                   key={index}
//                   className="h-[132px] w-[300px] sm:h-[148px] sm:w-80"
//                 >
//                   {index + 3}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="relative flex flex-col">
//             <span className="absolute -top-5 left-3 text-[12px] opacity-50">
//               Sortuj według
//             </span>
//             <select
//               className="shadow-custom-inner h-12 w-max rounded-md bg-secondary px-2 text-sm"
//               onChange={(e) => handleSortChange(e.target.value)}
//             >
//               <option value="points -1">Punkty - malejąco</option>
//               <option value="points 1">Punkty - rosnąco</option>
//               <option value="updatedAt -1">Najnowsze</option>
//               <option value="updatedAt 1">Najstarsze</option>
//             </select>
//           </div>
