import { useNavigate } from "react-router-dom";
import { TileTitle } from "./TileTitle";

export const StatsCard = ({
  name,
  value,
  maxValue,
  hiperlink,
}: {
  name: string;
  value: number;
  maxValue?: number;
  hiperlink?: string;
}) => {
  const navigate = useNavigate();

  const handleChangePage = (destiny: string) => {
    navigate(destiny);
  };

  return (
    <div className="relative flex h-32 w-80 flex-col justify-between rounded-lg border-l-4 border-extras bg-secondary">
      <TileTitle>{name}</TileTitle>
      <div className="relative bottom-5 left-6 text-xl text-extras">
        {value}
        <span className="text-baseText">{maxValue && `/${maxValue}`}</span>
      </div>

      {hiperlink && (
        <div
          className="absolute bottom-3 right-3 cursor-pointer text-xs underline opacity-50 hover:opacity-100"
          onClick={() => handleChangePage(hiperlink)}
        >
          Przejdź
        </div>
      )}
    </div>
  );
};
