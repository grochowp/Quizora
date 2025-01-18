import { useNavigate } from "react-router-dom";
import { TileTitle } from "./TileTitle";
import { Tooltip, Zoom } from "@mui/material";

export const StatsCard = ({
  name,
  value,
  maxValue,
  hiperlink,
  hint,
}: {
  name: string;
  value: number;
  maxValue?: number;
  hiperlink?: string;
  hint?: string;
}) => {
  const navigate = useNavigate();

  const handleChangePage = (destiny: string) => {
    navigate(destiny);
  };

  return (
    <Tooltip
      title={hint}
      placement="top"
      slots={{
        transition: Zoom,
      }}
    >
      <div className="relative flex h-32 w-[308px] flex-col justify-between rounded-lg border-l-4 border-extras bg-secondary">
        <TileTitle>{name}</TileTitle>
        <div className="relative bottom-5 left-6 w-[80%] text-xl text-extras">
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
    </Tooltip>
  );
};
