import { useMemo } from "react";
import { useAchievements } from "./useAchievements";
import { IUser } from "../interfaces";

export const useUserAchievements = (loggedUserData: IUser | undefined) => {
  const { data: achievements, isLoading, error } = useAchievements();

  const { userAchievements, userTitles, allAchievements, allTitles } =
    useMemo(() => {
      const userAchievements =
        loggedUserData?.userProfile?.achievements.reduce(
          (total, achievement) => total + (achievement.level - 1),
          0,
        ) || 0;

      const userTitles = loggedUserData?.userProfile?.titles?.length || 0;

      const allAchievements =
        achievements?.reduce((acc, val) => acc + val.levels.length - 1, 0) || 0;

      const allTitles =
        achievements?.reduce((acc, achievement) => {
          const titleCount = achievement.levels.filter(
            (level) => level.title,
          ).length;
          return acc + titleCount;
        }, 0) || 0;

      return { userAchievements, userTitles, allAchievements, allTitles };
    }, [loggedUserData?.userProfile, achievements]);

  return {
    userAchievements,
    userTitles,
    allAchievements,
    allTitles,
    isLoading,
    error,
  };
};
