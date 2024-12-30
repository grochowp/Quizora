import { IAchievement, IUserAchievemnt } from "../../../interfaces";
import { TileTitle } from "../../../components/reusable/TileTitle";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { CiTrophy } from "react-icons/ci";

export const Achievement = ({ achievement }: { achievement: IAchievement }) => {
  const { loggedUserData } = useLoggedUserContext();

  const userAchievement = loggedUserData?.userProfile?.achievements.find(
    (userAchievement: IUserAchievemnt) =>
      userAchievement.achievementId === achievement._id,
  );

  const userLevel = userAchievement?.level || 1;

  return (
    <div className="flex h-[150px] w-[400px] flex-col justify-between rounded-lg border-l-4 border-extras bg-secondary">
      <div className="relative flex items-center justify-between">
        <TileTitle>{achievement.name}</TileTitle>
        <div className="mr-2 rounded-lg bg-primary px-2 py-2 text-[10px]">
          {userLevel === 5 ? `Aktualny postęp: ` : `Następny poziom: `}

          <strong className="text-extras">
            {`${userAchievement?.value}${userLevel !== 5 ? `/${achievement.levels[userLevel]?.requirement}` : ""}`}
          </strong>
        </div>
        <div className="absolute left-6 top-12 text-[10px]">
          {userLevel === 5 ? "" : "W trakcie: "}
          <strong className="text-extras">
            {userLevel === 5
              ? "Ukończono"
              : achievement.levels[userLevel]?.title
                ? `${achievement.levels[userLevel].title} `
                : `${achievement.description} ${userLevel}`}
          </strong>
        </div>
      </div>

      <div className="mx-6 flex items-center justify-between pb-8">
        {achievement.levels.map((level: IAchievement["levels"][0]) => {
          const isAchieved = userLevel >= level.level;
          const isCurrentLevel = userLevel === level.level;

          return (
            <div
              key={level.level}
              className={`relative flex h-6 w-6 flex-col gap-2 rounded-full border-[1px] bg-baseText ${isAchieved ? "opacity-100" : "opacity-25"} ${achievement.levels.indexOf(level) !== 0 ? "before:absolute before:right-8 before:top-3 before:h-[1px] before:w-4 before:bg-baseText before:sm:w-10" : ""} ${isCurrentLevel && userLevel !== 5 ? "scale-125 border-4 border-red-600 bg-extras bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg" : ""}`}
            >
              {level.title && (
                <span
                  className={`${isCurrentLevel && userLevel !== 5 && "text-extras"} absolute -top-6 left-[3px]`}
                >
                  <CiTrophy />
                </span>
              )}
              <span
                className={`relative text-center text-[10px] ${isCurrentLevel && userLevel !== 5 ? "top-[26px] text-extras" : "top-8"}`}
              >
                {loggedUserData?.userProfile?.checkpoints
                  ? `${level?.requirement}`
                  : `Poziom ${level.level}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
