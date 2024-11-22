import React from "react";
import { IUser } from "../../interfaces";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export const UserCard = ({
  user,
  children,
  editButton = false,
}: {
  user: IUser | undefined;
  children: React.ReactNode;
  editButton?: boolean;
}) => {
  const navigate = useNavigate();
  const navigateToSettings = () => {
    navigate("/settings");
  };

  return (
    <div className="relative grid w-[300px] min-w-max grid-cols-6 grid-rows-[auto_auto_auto] gap-2 rounded-lg border-l-4 bg-secondary md:grid-rows-2 lg:w-96 lg:grid-cols-8">
      <img
        className="shadow-custom-inner col-span-2 col-start-1 row-span-2 row-start-1 ml-4 mt-4 h-20 w-20 rounded-lg md:mb-4"
        src={user?.profilePicture}
      />
      {children}
      {editButton && (
        <div
          className="absolute -top-2 right-4 -z-10 h-2 w-8 cursor-pointer rounded-t-md bg-extras text-xs transition-all duration-500 hover:h-8 hover:-translate-y-6"
          onClick={navigateToSettings}
        >
          <CiEdit className="h-8 w-8 text-primary" />
        </div>
      )}
    </div>
  );
};