import { useState } from "react";
import { TileTitle } from "../../../components/reusable/TileTitle";

import { useLoggedUserContext } from "../../../contexts/loggedUserContext";
import { Themes } from "./Themes";

export const Preferences = () => {
  const { loggedUserData } = useLoggedUserContext();
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(
    loggedUserData?.userProfile?.theme,
  );

  const handleTheme = (theme: string) => {
    setSelectedTheme(theme);
  };

  return (
    <div className="flex w-full min-w-[300px] flex-col gap-4 rounded-lg border-l-4 border-extras bg-secondary">
      <div className="relative flex">
        <TileTitle>Motyw</TileTitle>
        {/* <EditButton /> */}
      </div>
      <Themes
        user={loggedUserData}
        selectedTheme={selectedTheme}
        handleTheme={handleTheme}
      />

      <div className="relative flex">
        <TileTitle>Preferencje</TileTitle>
      </div>
    </div>
  );
};
