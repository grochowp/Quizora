import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { IStatus } from "../../../interfaces";

const statusPublic: IStatus[] = [
  {
    status: "published",
    text: "Opublikowane",
  },
  {
    status: "liked",
    text: "Polubione",
  },
];

const statusPrivate: IStatus[] = [
  {
    status: "published",
    text: "Opublikowane",
  },
  {
    status: "liked",
    text: "Polubione",
  },
  {
    status: "archived",
    text: "Zarchiwizowane",
  },
  {
    status: "draft",
    text: "Draft",
  },
];

export const StatusSelect = ({
  status,
  userId,
  onClick,
}: {
  status: string;
  userId: string | undefined;
  onClick: (status: string) => void;
}) => {
  const { loggedUserData } = useLoggedUserContext();

  const statusArray =
    loggedUserData?._id === userId ? statusPrivate : statusPublic;

  return (
    <div className="flex flex-wrap justify-center gap-6 md:text-xl">
      {statusArray.map((item: IStatus) => (
        <span
          key={item.text}
          className={`cursor-pointer ${status === item.status ? "!important border-b-[1px] border-baseText opacity-100" : "opacity-35"}`}
          onClick={() => onClick(item.status)}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
};
