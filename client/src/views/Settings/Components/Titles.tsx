import React from "react";
import { TileTitle } from "../../../components/reusable/TileTitle";
import { EditButton } from "../../../components/reusable/elements/Button";
import { useLoggedUserContext } from "../../../contexts/loggedUserContext";

export const Titles = () => {
  const { loggedUserData } = useLoggedUserContext();

  return (
    <div className="flex h-28 w-full min-w-[300px] max-w-full flex-1 flex-col rounded-lg border-l-4 border-extras bg-secondary text-baseText md:max-w-[1000px]">
      <div className="relative flex h-max w-full items-center">
        <TileTitle>Wybrane Tytuły</TileTitle>
        <EditButton onClick={() => 1} />
      </div>
      <div className="my-4 ml-6 flex h-full items-center gap-2">
        {loggedUserData?.activeTitles.length !== 0 &&
          loggedUserData?.activeTitles.map((title) => (
            <React.Fragment key={title}>
              <span
                key={title}
                className="rounded-md bg-extras px-3 py-[2px] font-roboto text-[14px] text-primary md:text-[17px]"
              >
                {title}
              </span>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};
