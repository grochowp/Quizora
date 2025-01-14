import { RankingContainer } from "./components/RankingContainer";
import { StatsContainer } from "./components/StatsContainer";

const Ranking = () => {
  return (
    <div className="flex h-max w-full flex-wrap items-stretch justify-center gap-8 2xl:flex-row-reverse">
      <RankingContainer />
      <StatsContainer />
    </div>
  );
};

export default Ranking;
