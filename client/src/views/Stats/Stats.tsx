import { StatsContainer } from "../Ranking/components/StatsContainer";

const Stats = () => {
  return (
    <div className="flex w-[300px] flex-col items-center gap-16 font-roboto sm:w-[320px] lg:w-[660px] xl:w-[984px] 2xl:w-[1316px]">
      <StatsContainer horizontal={false} extraStats />
    </div>
  );
};

export default Stats;
