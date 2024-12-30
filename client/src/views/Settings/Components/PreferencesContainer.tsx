import { useEffect, useState } from "react";
import { TileTitle } from "../../../components/reusable/TileTitle";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { Themes } from "./Themes";
import { preferences } from "../../../utils/preferences";
import { Button } from "../../../components/reusable/elements/Button";
import { Preferences } from "./Preferences";
import { UpdatePreferences } from "../../../services/userService";
import FullPageSpinner from "../../../components/reusable/FullPageSpinner";
import { useModalContext } from "../../../contexts/ModalContext";
import { CiEdit } from "react-icons/ci";
import { TopModal } from "../../../components/reusable/modals/TopModal";

export const PreferencesContainer = () => {
  const { loggedUserData, editUser } = useLoggedUserContext();
  const { openModal } = useModalContext();
  const [activeButtons, setActiveButtons] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string>(
    loggedUserData?.userProfile?.theme || "default",
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

  useEffect(() => {
    const userProfile = loggedUserData?.userProfile;
    const hasChanges =
      userProfile?.checkpoints === preferenceStates["checkpoints"] &&
      userProfile?.lessAnimations === preferenceStates["lessAnimations"] &&
      userProfile?.privateAccount === preferenceStates["privateAccount"] &&
      userProfile?.theme === selectedTheme;

    setActiveButtons(hasChanges);
  }, [loggedUserData, preferenceStates, selectedTheme]);

  const userTitles = loggedUserData?.userProfile?.titles;
  console.log(loggedUserData?.userProfile);
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
    const userProfile = loggedUserData?.userProfile;

    setSelectedTheme(loggedUserData?.userProfile?.theme || "default");
    setPreferenceStates({
      checkpoints: userProfile?.checkpoints as boolean,
      lessAnimations: userProfile?.lessAnimations as boolean,
      privateAccount: userProfile?.privateAccount as boolean,
    });
  };

  const updatePreferences = async () => {
    try {
      setIsLoading(true);
      const response = await UpdatePreferences({
        ...preferenceStates,
        theme: selectedTheme,
      });

      editUser(response.user);
      openModal(
        <TopModal
          label="Pomyślnie zaktualizowano preferencje!"
          icon={<CiEdit />}
        />,
        "top",
        5,
      );
    } catch (err) {
      resetPreferences();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`${isLoading && "pointer-events-none opacity-50"} relative flex w-full min-w-[300px] flex-col gap-4 rounded-lg border-l-4 border-extras bg-secondary text-baseText`}
      >
        {isLoading && <FullPageSpinner />}
        <div
          className={`absolute h-full w-full transition-none ${activeButtons && "pointer-events-none opacity-15"}`}
        >
          <Button
            styles="absolute right-40 bottom-4 px-5 py-1"
            variant="outline"
            disabled={activeButtons}
            onClick={resetPreferences}
          >
            Anuluj
          </Button>
          <Button
            styles="absolute right-6 bottom-4 px-5 py-1"
            variant="fill"
            disabled={activeButtons}
            onClick={updatePreferences}
          >
            Zatwierdź
          </Button>
        </div>

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
    </>
  );
};
