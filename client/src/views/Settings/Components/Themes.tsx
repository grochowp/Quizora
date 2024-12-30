import { CiLock } from "react-icons/ci";
import { themes } from "../../../utils/preferences";
import { IThemes } from "../../../interfaces";

export const Themes = ({
  userTitles,
  selectedTheme,
  handleTheme,
}: {
  userTitles: string[] | undefined;
  selectedTheme: string | undefined;
  handleTheme: (theme: string) => void;
}) => {
  return (
    <div className="mx-6 flex flex-row flex-wrap gap-4 last:mb-8">
      {themes.map((theme: IThemes) => {
        const titleNotUnlocked =
          theme.unlockAt && !userTitles?.includes(theme.unlockAt);
        return (
          <div
            key={theme.name}
            className={`${titleNotUnlocked && "pointer-events-none"} relative flex cursor-pointer flex-col`}
            onClick={() => handleTheme(theme.name)}
          >
            <img
              src={`/assets/theme-light.png`} // TO-DO --- change to correct images
              className={`w-28 rounded-lg border-4 ${titleNotUnlocked && "opacity-25"} ${selectedTheme === theme.name ? "border-extras" : "border-transparent"} lg:w-48`}
            />
            <h2
              className={`${selectedTheme === theme.name ? "text-extras" : "text-baseText"} `}
            >
              {theme.label}
            </h2>
            {titleNotUnlocked && (
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-[80%] flex-col items-center text-extras lg:-translate-y-2/3">
                <CiLock className="lg:h-7 lg:w-7" />
                <h3 className="text-xs lg:text-base">{theme.unlockAt}</h3>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
