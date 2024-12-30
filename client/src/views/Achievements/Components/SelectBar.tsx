import { useMemo } from "react";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";

export const SelectBar = ({
  handleStatus,
  status,
}: {
  handleStatus: (props: string) => void;
  status: string;
}) => {
  const { loggedUserData } = useLoggedUserContext();
  const statusMap = {
    all: "Wszystkie",
    finished: "Ukończone",
    inProgress: "W trakcie",
  };

  const { userAchievements, userTitles } = useMemo(() => {
    const userAchievements = loggedUserData?.userProfile?.achievements.reduce(
      (total, achievement) => total + achievement.level - 1,
      0,
    );

    const userTitles = loggedUserData?.userProfile?.titles || [];
    return { userAchievements, userTitles };
  }, [loggedUserData?.userProfile]);

  return (
    <div className="flex w-full justify-between rounded-lg border-l-4 border-extras bg-secondary px-4 py-3 text-[18px]">
      <div className="flex gap-8">
        <span>
          Zdobyte osiągnięcia:{" "}
          <strong className="text-extras">{userAchievements}/22</strong>
        </span>
        <span>
          Zdobyte tytuły:{" "}
          <strong className="text-extras">{userTitles.length}/8</strong>
        </span>
      </div>

      <div className="flex gap-4">
        {Object.entries(statusMap).map(([key, value]) => (
          <span
            onClick={() => handleStatus(key)}
            key={key}
            className={`${status !== key && "opacity-50"} cursor-pointer`}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};
