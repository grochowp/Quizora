import { IAchievement, IUserAchievemnt } from "../../../interfaces";
import { TileTitle } from "../../../components/reusable/TileTitle";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { CiTrophy } from "react-icons/ci";
import React from "react";
import { Tooltip, Zoom } from "@mui/material";

export const Achievement = ({ achievement }: { achievement: IAchievement }) => {
  const { loggedUserData } = useLoggedUserContext();

  const userAchievement = loggedUserData?.userProfile?.achievements.find(
    (userAchievement: IUserAchievemnt) =>
      userAchievement.achievementId === achievement._id,
  );
  const maxAchievementLevel = achievement.levels.length;
  const userLevel = userAchievement?.level || 1;

  return (
    <div className="flex h-[150px] w-[400px] flex-col justify-between rounded-lg border-l-4 border-extras bg-secondary">
      <div className="relative flex items-center justify-between">
        <TileTitle>{achievement.name}</TileTitle>
        <div className="mr-2 rounded-lg bg-primary px-2 py-2 text-[8px] sm:text-[10px]">
          {userLevel === maxAchievementLevel
            ? `Aktualny postęp: `
            : `Następny poziom: `}

          <strong className="text-extras">
            {`${userAchievement?.value}${userLevel !== maxAchievementLevel ? `/${achievement.levels[userLevel]?.requirement}` : ""}`}
          </strong>
        </div>
        <div className="absolute left-6 top-12 text-[10px]">
          {userLevel === maxAchievementLevel ? "" : "W trakcie: "}
          <strong className="text-extras">
            {userLevel === maxAchievementLevel
              ? "Ukończono"
              : achievement.levels[userLevel]?.title
                ? `${achievement.levels[userLevel].title} `
                : `${achievement.description} ${userLevel}`}
          </strong>
        </div>
      </div>

      <div className="mx-6 flex items-center justify-between pb-2">
        {achievement.levels.map((level: IAchievement["levels"][0]) => {
          const isAchieved = userLevel >= level.level;
          const isCurrentLevel = userLevel === level.level;

          return (
            <React.Fragment key={level._id}>
              <div className="flex flex-col items-center gap-1">
                <Tooltip
                  title={level.title}
                  placement="top"
                  slots={{
                    transition: Zoom,
                  }}
                >
                  <span
                    className={`${isAchieved && level.title ? "opacity-100" : level.title ? "opacity-25" : "opacity-0"}`}
                  >
                    <CiTrophy />
                  </span>
                </Tooltip>
                <div
                  className={`h-5 w-5 rounded-full bg-baseText sm:h-6 sm:w-6 ${isAchieved ? "opacity-100" : "opacity-25"} ${isCurrentLevel && userLevel !== 5 && "bg-extras"}`}
                ></div>
                <Tooltip
                  title={`Wymagany postęp: ${level.requirement}`}
                  slots={{
                    transition: Zoom,
                  }}
                >
                  <span
                    className={`flex flex-nowrap text-[9px] sm:text-[10px] ${isAchieved || "opacity-25"}`}
                  >
                    {loggedUserData?.userProfile?.checkpoints
                      ? `${level?.requirement}`
                      : `Poziom ${level.level}`}
                  </span>
                </Tooltip>
              </div>
              {level.level !== maxAchievementLevel && (
                <div
                  className={`h-[1px] w-4 sm:-left-5 sm:w-8 ${userLevel > level.level ? "bg-baseText" : "bg-[#3f3f3f]"}`}
                >
                  {userAchievement && userLevel === level.level && (
                    <div
                      className={`relative h-[1px] bg-extras`}
                      style={{
                        width: `${
                          ((userAchievement?.value -
                            achievement.levels[userLevel - 1]?.requirement) /
                            (achievement.levels[userLevel]?.requirement -
                              achievement.levels[userLevel - 1]?.requirement)) *
                          100
                        }%`,
                      }}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/**${achievement.levels.indexOf(level) !== 5 ? "after:absolute after:right-8 after:top-3 after:h-[1px] after:w-4 after:bg-baseText after:sm:w-10" : ""} */

// <div
//   key={level.level}
//   className={`relative flex h-6 w-6 flex-col gap-2 rounded-full border-[1px] bg-baseText ${isAchieved ? "opacity-100" : "opacity-25"} ${isCurrentLevel && userLevel !== 5 ? "scale-125 border-4 border-red-600 bg-extras bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg" : ""}`}
// >
//   {level.title && (
//     <span
//       className={`${isCurrentLevel && userLevel !== 5 && "text-extras"} absolute -top-6 left-[3px]`}
//     >
//       <CiTrophy />
//     </span>
//   )}
//   <span
//     className={`relative flex-nowrap text-center text-[10px] ${isCurrentLevel && userLevel !== 5 ? "top-[26px] text-extras" : "top-8"}`}
//   >
//     {loggedUserData?.userProfile?.checkpoints
//       ? `${level?.requirement}`
//       : `Poziom ${level.level}`}
//   </span>
// </div>
