import { IAchievement } from "../../../interfaces";
import { Achievement } from "./Achievement";

export const AchievementContainer = ({
  achievements,
}: {
  achievements: IAchievement[] | undefined;
}) => {
  return (
    <div className="flex flex-wrap justify-between gap-y-8">
      {achievements?.map((achievement: IAchievement) => (
        <Achievement achievement={achievement} />
      ))}
    </div>
  );
};
