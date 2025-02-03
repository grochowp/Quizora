import { StatsCard } from "../../../components/reusable/StatsCard";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { IStatsTileData } from "../../../interfaces";
import { useUserAchievements } from "../../../hooks/useUserAchievements";
import Spinner from "../../../components/reusable/Spinner";

export const StatsContainer = ({
  horizontal = true,
  extraStats = false,
}: {
  horizontal?: boolean;
  extraStats?: boolean;
}) => {
  const { loggedUserData } = useLoggedUserContext();

  const {
    userAchievements,
    userTitles,
    allAchievements,
    allTitles,
    isLoading,
  } = useUserAchievements(loggedUserData);

  const statsData: IStatsTileData[] = [
    {
      name: "Stworzone Quizy",
      value: loggedUserData?.createdQuizzes || 0,
      hiperlink: "/quiz/manage",
      hint: "Wartość może się różnić od wartości w osiągnięciach. Dotyczy tylko Quizów, które aktualnie są dostępne.",
    },
    {
      name: "Rozwiązane Quizy",
      value: loggedUserData?.finishedQuizzes || 0,
      hiperlink: "/quizzes",
    },
    {
      name: "Ocenione Quizy",
      value: loggedUserData?.likedQuizzes || 0,
      hiperlink: "/profile",
      extra: true,
    },
    { name: "Zdobyte punkty", value: loggedUserData?.points || 0 },
    {
      name: "Zdobyte osiągnięcia",
      value: userAchievements,
      maxValue: allAchievements,
      hiperlink: "/achievements",
    },
    {
      name: "Zdobyte tytuły",
      value: userTitles,
      maxValue: allTitles,
      hiperlink: "/achievements",
    },
  ];

  return (
    <section
      className={`mb-8 flex justify-center gap-5 gap-x-11 md:flex-wrap lg:justify-normal xl:gap-x-[30px] 2xl:mb-0 ${horizontal && "flex-col md:flex-row 2xl:flex-col"} 2xl:justify-center`}
    >
      {loggedUserData &&
        statsData
          .filter((stats) => extraStats || !stats.extra)
          .map((stats) => {
            return isLoading ? (
              <div className="relative flex h-32 w-80 flex-col justify-between">
                <Spinner />
              </div>
            ) : (
              <StatsCard
                key={stats.name}
                name={stats.name}
                value={stats.value}
                maxValue={stats.maxValue}
                hiperlink={stats.hiperlink}
                hint={stats.hint}
              />
            );
          })}
    </section>
  );
};
