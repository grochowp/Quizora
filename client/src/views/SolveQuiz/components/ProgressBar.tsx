import { memo } from "react";

interface IPoints {
  max: number;
  progress: number;
}

export const ProgressBar: React.FC<IPoints> = memo(({ max, progress }) => {
  return (
    <div className="font-poppins">
      <div className="mb-3 flex justify-center text-lg md:text-2xl">
        <h1 className="">Zdobyte punkty</h1>
      </div>
      <div className="h-6 w-full rounded-full bg-secondary md:h-8">
        <div
          className="relative h-6 w-20 rounded-full bg-extras md:h-8"
          style={{ width: `${(progress / max) * 100}%` }}
        >
          <span className="absolute -top-[1px] right-2 font-roboto text-lg text-primary md:right-3 md:top-[2px] md:text-xl">
            {progress}
          </span>
        </div>
      </div>
      <div className="flex w-full justify-between font-roboto text-lg md:text-xl">
        <span className="ml-2 mt-1">0</span>
        <span className="mr-2 mt-1">{max}</span>
      </div>
    </div>
  );
});
