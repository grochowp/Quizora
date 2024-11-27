import React from "react";
import { Button } from "../../../components/reusable/elements/Button";
import CustomInput from "../../../components/reusable/elements/CustomInput";
import { TileTitle } from "../../../components/reusable/TileTitle";
import { IQuizFilters } from "../../../interfaces";

export const GeneralInformations = ({
  filters,
  updateFilter,
  handleAddQuiz,
}: {
  filters: IQuizFilters;
  updateFilter: (key: string, value: string) => void;
  handleAddQuiz: () => void;
}) => {
  return (
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
  );
};
