import { useState } from "react";
import { SelectBar } from "./Components/SelectBar";
import { IAchievement, IUserAchievemnt } from "../../interfaces";
import Error from "../Error/Error";
import Spinner from "../../components/reusable/Spinner";
import { Achievement } from "./Components/Achievement";
import { useLoggedUserContext } from "../../contexts/LoggedUserContext";
import { useAchievements } from "../../hooks/useAchievements";

const Achievements = () => {
  const [status, setStatus] = useState<string>("all");
  const { loggedUserData } = useLoggedUserContext();
  const { data, isLoading, error } = useAchievements();

  const filteredAchievements = data?.filter((achievement: IAchievement) => {
    const userAchievement = loggedUserData?.userProfile?.achievements.find(
      (userAch: IUserAchievemnt) => userAch.achievementId === achievement._id,
    );

    if (status === "all") return true;

    if (status === "finished")
      return (
        userAchievement && userAchievement.level === achievement.levels.length
      );

    if (status === "inProgress")
      return (
        userAchievement && userAchievement.level < achievement.levels.length
      );

    return false;
  });

  if (error) return <Error />;

  const handleStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  return (
    <div className="flex h-full w-full flex-col gap-16">
      <SelectBar handleStatus={handleStatus} status={status} />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-wrap justify-center gap-y-8 xl:justify-between">
          {filteredAchievements?.map((achievement: IAchievement) => (
            <Achievement key={achievement._id} achievement={achievement} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
