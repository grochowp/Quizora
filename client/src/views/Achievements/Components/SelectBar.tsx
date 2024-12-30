import { useMemo } from "react";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { IAchievement } from "../../../interfaces";
import { statusMap } from "../Achievements";

export const SelectBar = ({
  handleStatus,
  status,
  achievements,
}: {
  handleStatus: (props: string) => void;
  status: string;
  achievements: IAchievement[] | undefined;
}) => {
  const { loggedUserData } = useLoggedUserContext();

  const allAchievements = achievements?.reduce(
    (acc, val) => acc + val.levels.length - 1,
    0,
  );

  const allTitles = achievements?.reduce((acc, achievement) => {
    const titleCount = achievement.levels.filter((level) => level.title).length;
    return acc + titleCount;
  }, 0);

  const { userAchievements, userTitles } = useMemo(() => {
    const userAchievements = loggedUserData?.userProfile?.achievements.reduce(
      (total, achievement) => total + achievement.level - 1,
      0,
    );

    const userTitles = loggedUserData?.userProfile?.titles || [];
    return { userAchievements, userTitles };
  }, [loggedUserData?.userProfile]);

  return (
    <div className="flex min-h-[60px] w-full flex-col items-center justify-between gap-8 rounded-lg border-l-4 border-extras bg-secondary px-4 py-3 text-[18px] sm:gap-4 xl:flex-row">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-8">
        <span>
          Zdobyte osiągnięcia:{" "}
          <strong className="text-extras">
            {userAchievements}/{allAchievements}
          </strong>
        </span>
        <span>
          Zdobyte tytuły:{" "}
          <strong className="text-extras">
            {userTitles.length}/{allTitles}
          </strong>
        </span>
      </div>

      <div className="flex gap-4 text-base sm:gap-8 sm:text-[18px]">
        {Object.entries(statusMap).map(([key, value]) => (
          <span
            onClick={() => handleStatus(key)}
            key={key}
            className={`${status !== key ? "opacity-50" : "scale-110"} cursor-pointer`}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};
