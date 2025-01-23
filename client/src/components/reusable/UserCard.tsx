import React from "react";
import { IUser } from "../../interfaces";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Tooltip, Zoom } from "@mui/material";

export const UserCard = ({
  user,
  children,
  editButton = false,
  styles,
  onClick,
}: {
  user: IUser | undefined;
  children: React.ReactNode;

  editButton?: boolean;
  styles?: string;
  onClick?: () => void;
}) => {
  const navigate = useNavigate();

  const navigateToSettings = () => {
    navigate("/settings");
  };

  return (
    <div
      className={`${styles} group relative grid min-w-max flex-1 grid-cols-6 gap-2 rounded-lg border-l-4 border-extras bg-secondary md:grid-rows-2 lg:grid-cols-8`}
    >
      <img
        className="shadow-custom-inner col-span-2 col-start-1 row-span-2 row-start-1 mb-4 ml-4 mt-4 h-20 w-20 rounded-lg"
        src={user?.profilePicture}
      />
      {children}
      {editButton && (
        <Tooltip
          title={onClick ? "Edytuj" : "Ustawienia"}
          placement="right"
          slots={{
            transition: Zoom,
          }}
        >
          <div
            className="absolute -top-2 right-4 -z-10 h-2 w-8 cursor-pointer rounded-t-md bg-extras text-xs transition-all duration-100 group-hover:h-8 group-hover:-translate-y-6"
            onClick={onClick || navigateToSettings}
          >
            <CiEdit className="h-8 w-8 text-primary" />
          </div>
        </Tooltip>
      )}
    </div>
  );
};
