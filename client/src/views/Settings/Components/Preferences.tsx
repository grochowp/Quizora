import React from "react";
import { CiLock } from "react-icons/ci";
import { preferences } from "../../../utils/preferences";

export const Preferences = ({
  userTitles,
  togglePreference,
  preferenceStates,
}: {
  userTitles: string[] | undefined;
  togglePreference: (pref: string) => void;
  preferenceStates: Record<string, boolean>;
}) => {
  return (
    <div className="mb-16 grid grid-cols-1 gap-6 xl:grid-cols-2">
      {preferences.map((preference) => {
        const titleNotUnlocked =
          preference.unlockAt && !userTitles?.includes(preference.unlockAt);

        return (
          <div
            key={preference.name}
            className="relative flex w-full flex-col px-6 after:h-[1px] after:w-[100%] after:bg-baseText"
          >
            <h1 className="max-w-[70%] text-base lg:text-xl">
              {titleNotUnlocked ? "Ukryte" : preference.title}
            </h1>
            <h2 className="h-12 max-w-[70%] text-[10px] opacity-50 lg:text-sm">
              {titleNotUnlocked ? "Ukryte" : preference.description}
            </h2>
            <div
              onClick={() => togglePreference(preference.name)}
              className={`${titleNotUnlocked && "pointer-events-none opacity-50"} absolute right-4 top-0 mr-2 h-6 w-12 cursor-pointer rounded-2xl bg-baseText lg:h-8 lg:w-14`}
            >
              <div
                className={`relative left-1 top-1 h-4 w-4 rounded-xl transition-all duration-300 ${
                  preferenceStates[preference.name]
                    ? "left-[26px] bg-extras"
                    : "bg-secondary"
                } lg:h-6 lg:w-6`}
              />
              {titleNotUnlocked && (
                <div className="absolute -left-3 top-[110%] flex flex-row items-center text-extras lg:top-1/2 lg:-translate-x-full lg:-translate-y-1/2 lg:flex-row-reverse">
                  <CiLock className="lg:h-7 lg:w-7" />
                  <h3 className="text-xs lg:text-base">
                    {preference.unlockAt}
                  </h3>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
