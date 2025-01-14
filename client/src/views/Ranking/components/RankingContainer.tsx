import { useRef, useState } from "react";
import CustomInput from "../../../components/reusable/elements/CustomInput";
import CustomSelect from "../../../components/reusable/elements/CustomSelect";
import { IOptions } from "../../../interfaces";
import { RankingTable } from "./RankingTable";
import { useKey } from "../../../hooks/useKey";

const sortOptions: IOptions[] = [
  { value: "points", label: "Punkty" },
  { value: "finishedQuizzes", label: "Ukończone Quizy" },
  { value: "createdQuizzes", label: "Stworzone Quizy" },
  { value: "likedQuizzes", label: "Ocenione Quizy" },
];

export const RankingContainer = () => {
  const [query, setQuery] = useState<string>("");
  const [sortType, setSortType] = useState<string>("points");
  const inputEl = useRef<HTMLInputElement>(null);

  useKey(() => {
    if (inputEl.current && document.activeElement === inputEl.current) {
      setQuery("");
      inputEl.current.blur();
    }
  }, "Escape");

  return (
    <div className="mb-8 min-h-max min-w-[320px] rounded-lg border-l-4 border-extras bg-secondary lg:flex-1 2xl:mb-0">
      <div className="inputBox m-4 mt-6 flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-0">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-4">
          <CustomInput
            label="Nazwa"
            type="text"
            color="primary"
            value={query}
            onChange={(value) => setQuery(value)}
            ref={inputEl}
          />
          <CustomSelect
            label="Sortuj według"
            options={sortOptions}
            color="primary"
            value={sortType}
            onChange={(value) => setSortType(value)}
          />
        </div>
      </div>

      <RankingTable query={query} sortBy={sortType} />
    </div>
  );
};
