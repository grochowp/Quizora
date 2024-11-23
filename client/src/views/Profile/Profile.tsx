import { useNavigate, useParams } from "react-router-dom";
import { QuizSelection } from "../../components/reusable/quiz/QuizSelection";
import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import Spinner from "../../components/reusable/Spinner";
import { UserCard } from "../../components/reusable/UserCard";
import { StatusSelect } from "./components/StatusSelect";
import ReactTimeAgo from "react-time-ago";

function Profile() {
  const { userId } = useParams();
  const [status, setStatus] = useState<string>("published");
  const navigate = useNavigate();
  const { user, error, isLoading } = useUser(userId);

  const handleChangeStatus = (newStatus: string) => {
    setStatus(newStatus);
  };
  const createDate = user?.createdAt || new Date();

  if (isLoading) return <Spinner />;

  if (error) navigate("/error");

  return (
    <div className="flex w-[300px] flex-col gap-16 sm:w-[320px] lg:w-[660px] xl:w-[984px] 2xl:w-[1316px]">
      <div className="flex flex-col items-center justify-between gap-4 border-b-[1px] border-secondary font-poppins lg:items-start xl:flex-row xl:items-end">
        <UserCard user={user} editButton>
          <h1 className="col-span-4 col-start-3 row-start-1 flex items-center gap-2 text-2xl">
            {user?.nickname}{" "}
            <span className="relative top-[3px] text-sm opacity-50">
              Punkty:{" "}
              <strong className="text-extras opacity-100">
                {user?.points}
              </strong>
            </span>
          </h1>

          <h2 className="relative bottom-8 left-[2px] col-span-4 col-start-3 row-start-2 flex items-center text-xs opacity-50 md:bottom-10">
            <ReactTimeAgo date={createDate} locale="pl-PL" />
          </h2>

          <div className="col-span-6 col-start-1 row-start-3 ml-4 flex flex-wrap items-center gap-2 pb-3 pt-1 md:col-start-3 md:row-start-2 md:mb-1 md:ml-0 md:pt-3">
            {user?.activeTitles.length !== 0 &&
              user?.activeTitles.map((title) => (
                <span
                  key={title}
                  className="rounded-md bg-extras px-3 py-[2px] font-roboto text-[13px] text-primary"
                >
                  {title}
                </span>
              ))}
          </div>
        </UserCard>

        <StatusSelect
          status={status}
          userId={userId}
          onClick={handleChangeStatus}
        />
      </div>
      <div className="flex justify-center">
        <QuizSelection userId={userId} status={status} />
      </div>
    </div>
  );
}

export default Profile;
