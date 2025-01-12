import { useQuery } from "@tanstack/react-query";
import { IAchievement } from "../interfaces";
import { fetchAchievements } from "../services/achievementService";

export const useAchievements = () => {
  return useQuery<IAchievement[]>({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
