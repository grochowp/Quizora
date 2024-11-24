import { useEffect, useState } from "react";
import { TileTitle } from "../../../components/reusable/TileTitle";

import { useLoggedUserContext } from "../../../contexts/loggedUserContext";
import { Themes } from "./Themes";
import { preferences } from "../../../utils/preferences";

import { Button } from "../../../components/reusable/elements/Button";
import { Preferences } from "./Preferences";

export const PreferencesContainer = () => {
  const { loggedUserData } = useLoggedUserContext();
  const [displayApplyButton, setDisplayApplyButton] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(
    loggedUserData?.userProfile?.theme,
  );
  const [preferenceStates, setPreferenceStates] = useState<
    Record<string, boolean>
  >(
    preferences.reduce(
      (acc, preference) => {
        if (loggedUserData?.userProfile)
          acc[preference.name] = loggedUserData?.userProfile[
            preference.name
          ] as boolean;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );
  const userProfile = loggedUserData?.userProfile;

  useEffect(() => {
    const hasChanges =
      userProfile?.checkpoints !== preferenceStates["checkpoints"] ||
      userProfile?.lessAnimations !== preferenceStates["lessAnimations"] ||
      userProfile?.privateAccount !== preferenceStates["privateAccount"] ||
      userProfile?.theme !== selectedTheme;

    setDisplayApplyButton(hasChanges);
  }, [loggedUserData, preferenceStates, selectedTheme]);

  const userTitles = loggedUserData?.userProfile?.titles;

  const togglePreference = (name: string) => {
    setPreferenceStates((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleTheme = (theme: string) => {
    setSelectedTheme(theme);
  };

  const resetPreferences = () => {
    setSelectedTheme(loggedUserData?.userProfile?.theme);
    setPreferenceStates({
      checkpoints: userProfile?.checkpoints as boolean,
      lessAnimations: userProfile?.lessAnimations as boolean,
      privateAccount: userProfile?.privateAccount as boolean,
    });
  };

  return (
    <div className="relative flex w-full min-w-[300px] flex-col gap-4 rounded-lg border-l-4 border-extras bg-secondary">
      {displayApplyButton && (
        <div className="absolute h-full w-full transition-none">
          <Button
            styles="absolute right-40 bottom-4 px-5 py-1"
            variant="outline"
            onClick={resetPreferences}
          >
            Reset
          </Button>
          <Button
            styles="absolute right-6 bottom-4 px-5 py-1"
            variant="fill"
            onClick={() =>
              console.log({ ...preferenceStates, theme: selectedTheme })
            }
          >
            Zatwierdź
          </Button>
        </div>
      )}
      <div className="relative flex">
        <TileTitle>Motyw</TileTitle>
      </div>
      <Themes
        userTitles={userTitles}
        selectedTheme={selectedTheme}
        handleTheme={handleTheme}
      />

      <div className="relative flex">
        <TileTitle>Preferencje</TileTitle>
      </div>
      <Preferences
        userTitles={userTitles}
        togglePreference={togglePreference}
        preferenceStates={preferenceStates}
      />
    </div>
  );
};
