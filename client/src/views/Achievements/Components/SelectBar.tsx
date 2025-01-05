import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { statusMap } from "../../../utils/maps";
import { useUserAchievements } from "../../../hooks/useUserAchievements";

export const SelectBar = ({
  handleStatus,
  status,
}: {
  handleStatus: (props: string) => void;
  status: string;
}) => {
  const { loggedUserData } = useLoggedUserContext();
  const {
    userAchievements,
    userTitles,
    allAchievements,
    allTitles,
    isLoading,
  } = useUserAchievements(loggedUserData);

  return (
    <div className="flex min-h-[60px] w-full flex-col items-center justify-between gap-8 rounded-lg border-l-4 border-extras bg-secondary px-4 py-3 text-[18px] sm:gap-4 xl:flex-row">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-8">
        <span>
          Zdobyte osiągnięcia:{" "}
          <strong className="text-extras">
            {isLoading
              ? "Ładowanie..."
              : `${userAchievements}/${allAchievements}`}{" "}
          </strong>
        </span>
        <span>
          Zdobyte tytuły:{" "}
          <strong className="text-extras">
            {isLoading ? "Ładowanie..." : `${userTitles}/${allTitles}`}
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
