import { Button } from "../../../components/reusable/elements/Button";

import CustomSelect from "../../../components/reusable/elements/CustomSelect";
import { TileTitle } from "../../../components/reusable/TileTitle";
import { IQuizFilters } from "../../../interfaces";
import {
  categoryOptions,
  difficultyOptions,
  timeOptions,
} from "../../../utils/selectOptions";

export const Parameters = ({
  filters,
  updateFilter,
  handleAddQuiz,
  questionsLength,
}: {
  filters: IQuizFilters;
  updateFilter: (key: string, value: string) => void;
  handleAddQuiz: () => void;
  questionsLength: number;
}) => {
  const calculatePoints = (
    time: number,
    difficulty: string,
    length: number,
  ) => {
    const difficultyModifier =
      difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

    let points = Math.round(
      (difficultyModifier * (4 + 10 / time) * length) / 3,
    );
    points = Math.max(5, Math.min(points, 90));

    return points;
  };
  return (
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
              <strong className="text-extras">{questionsLength}/15</strong>
            </span>
            <span className="text-xs">
              Punkty:{" "}
              <strong className="text-extras">
                {calculatePoints(
                  Number(filters.time),
                  filters.difficulty,
                  questionsLength,
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
  );
};
