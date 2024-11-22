import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomInput from "../elements/CustomInput";
import CustomSelect from "../elements/CustomSelect";
import {
  categoryOptions,
  difficultyOptions,
  orderOptions,
  questionCountOptions,
} from "../../../utils/selectOptions";
import { Button } from "../elements/Button";
import QuizSection from "./QuizSection";

export const QuizSelection = ({
  userId,
  status,
}: {
  userId?: string;
  status?: string;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    title: searchParams.get("title") || "",
    category: searchParams.get("category") || "",
    difficulty: searchParams.get("difficulty") || "",
    questionsNumber: searchParams.get("questionsCount") || "",
    sortBy: searchParams.get("sortBy") || "",
    order: searchParams.get("order") || "",
  });

  useEffect(() => {
    setQuery(searchParams.toString());
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const buildQuery = (filters: Record<string, string>) => {
    const queryParams = Object.entries(filters)
      .filter(([, value]) => value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    return new URLSearchParams(queryParams).toString();
  };

  const handleUpdate = () => {
    const newQuery = buildQuery(filters);
    setSearchParams(newQuery);
  };

  const handleReset = () => {
    const resetFilters = {
      title: "",
      category: "",
      difficulty: "",
      questionsNumber: "",
      sortBy: "",
      order: "",
    };
    setFilters(resetFilters);
    setSearchParams("");
  };

  return (
    <div className="flex max-w-[1600px] flex-col gap-16 font-poppins text-baseText">
      <section className="flex w-[300px] flex-col items-center justify-between gap-12 sm:w-[320px] lg:w-[660px] xl:w-[984px] xl:flex-row 2xl:w-[1316px]">
        <article className="inputBox flex flex-wrap justify-center gap-6 lg:justify-normal">
          <CustomInput
            styles="h-12 w-[276px] lg:w-[300px]"
            label="Nazwa"
            type="text"
            value={filters.title}
            onChange={(value) => updateFilter("title", value)}
          />

          <CustomSelect
            label="Kategoria"
            value={filters.category}
            options={categoryOptions}
            onChange={(value) => updateFilter("category", value)}
          />
          <CustomSelect
            label="Poziom"
            value={filters.difficulty}
            options={difficultyOptions}
            onChange={(value) => updateFilter("difficulty", value)}
          />
          <CustomSelect
            label="Ilość pytań"
            value={filters.questionsNumber}
            options={questionCountOptions}
            onChange={(value) => updateFilter("questionNumber", value)}
          />
          <CustomSelect
            label="Sortuj według"
            value={`${filters.sortBy} ${filters.order}`}
            options={orderOptions}
            onChange={(value) => {
              const [sortBy, order] = value.split(" ");
              updateFilter("sortBy", sortBy);
              updateFilter("order", order);
            }}
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

      <section className="flex max-w-[300px] flex-col sm:max-w-[320px] lg:max-w-[660px] xl:max-w-[984px] 2xl:max-w-[1316px]">
        <QuizSection
          reset={false}
          query={query}
          userId={userId}
          status={status}
          maxQuizzes={20}
        />
      </section>
    </div>
  );
};
