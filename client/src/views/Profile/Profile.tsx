import { useNavigate, useParams } from "react-router-dom";
import { QuizSelection } from "../../components/reusable/QuizSelection";
import { useState } from "react";
import { useLoggedUserContext } from "../../contexts/loggedUserContext";

import { useUser } from "../../hooks/useUser";
import Spinner from "../../components/reusable/Spinner";
import ReactTimeAgo from "react-time-ago";

const statusPublic = [
  {
    status: "published",
    text: "Opublikowane",
  },
  {
    status: "liked",
    text: "Polubione",
  },
];

const statusPrivate = [
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

function Profile() {
  const { userId } = useParams();
  const { loggedUserData } = useLoggedUserContext();
  const [status, setStatus] = useState<string>("published");
  const navigate = useNavigate();
  const { user, error, isLoading } = useUser(userId);
  const createDate = user?.createdAt || new Date();

  const arrayToMap =
    loggedUserData?._id === userId ? statusPrivate : statusPublic;

  const handleChangeStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  if (isLoading) return <Spinner />;

  if (error) navigate("/error");

  return (
    <section className="flex w-[300px] flex-col gap-16 sm:w-[320px] lg:w-[660px] xl:w-[984px] xl:gap-8 2xl:w-[1316px]">
      <div className="flex flex-col items-center justify-between gap-4 border-b-[1px] border-secondary font-poppins lg:items-start xl:flex-row xl:items-end">
        <div className="flex h-max w-[300px] min-w-max flex-col rounded-lg border-l-4 bg-secondary md:flex-row lg:w-96">
          <img
            className="shadow-custom-inner m-4 mr-2 h-20 w-20 rounded-lg"
            src={user?.profilePicture}
          />
          <div className="ml-4 flex min-w-max flex-col py-0 md:ml-0 md:py-3">
            <h1 className="gap-1 text-2xl">
              {user?.nickname}{" "}
              <span className="text-sm opacity-50">
                Punkty:{" "}
                <strong className="text-extras opacity-100">
                  {user?.points}
                </strong>
              </span>
            </h1>
            <h2 className="relative bottom-[6px] left-[2px] pb-1 text-xs opacity-50">
              Założono: <ReactTimeAgo date={createDate} locale="pl-PL" />
            </h2>
            {user?.activeTitles.length !== 0 && (
              <div className="flex h-max flex-wrap gap-2 pb-4 pr-2 md:pb-[2px]">
                {user?.activeTitles.map((title) => (
                  <span
                    key={title}
                    className="rounded-md bg-extras px-3 py-[2px] font-roboto text-[13px] text-primary lg:text-base"
                  >
                    {title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:text-xl">
          {arrayToMap.map((item) => (
            <span
              className={`cursor-pointer ${status === item.status ? "!important border-b-[1px] border-baseText opacity-100" : "opacity-35"}`}
              onClick={() => handleChangeStatus(item.status)}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>
      <QuizSelection userId={userId} status={status} />
    </section>
  );
}

export default Profile;
