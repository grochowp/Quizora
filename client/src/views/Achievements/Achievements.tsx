import { useState } from "react";
import { SelectBar } from "./Components/SelectBar";

const Achievements = () => {
  const [status, setStatus] = useState<string>("all");

  const handleStatus = (newStatus: string) => {
    setStatus(newStatus);
  };
  return (
    <div className="h-full w-full">
      <SelectBar handleStatus={handleStatus} status={status} />
    </div>
  );
};

export default Achievements;
