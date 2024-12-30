import { useState } from "react";
import { SelectBar } from "./Components/SelectBar";
import { AchievementContainer } from "./Components/AchievementContainer";
import { useQuery } from "@tanstack/react-query";
import { IAchievement } from "../../interfaces";
import { fetchAchievements } from "../../services/achievementService";
import Error from "../Error/Error";
import Spinner from "../../components/reusable/Spinner";

export const statusMap = {
  all: "Wszystkie",
  finished: "Ukończone",
  inProgress: "W trakcie",
};

const Achievements = () => {
  const [status, setStatus] = useState<string>("all");
  const { data, error, isLoading } = useQuery<IAchievement[]>({
    queryKey: ["achievements"],
    queryFn: () => fetchAchievements(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (error) return <Error />;

  if (isLoading) return <Spinner />;

  const handleStatus = (newStatus: string) => {
    setStatus(newStatus);
  };
  return (
    <div className="flex h-full w-full flex-col gap-16">
      <SelectBar
        handleStatus={handleStatus}
        status={status}
        achievements={data}
      />
      <AchievementContainer achievements={data} />
    </div>
  );
};

export default Achievements;
