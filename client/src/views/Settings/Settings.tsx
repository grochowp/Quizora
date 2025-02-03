import { UserCard } from "../../components/reusable/UserCard";
import { useLoggedUserContext } from "../../contexts/LoggedUserContext";
import { Titles } from "./Components/Titles";
import { PreferencesContainer } from "./Components/PreferencesContainer";
import ReactTimeAgo from "react-time-ago";

const Settings = () => {
  const { loggedUserData } = useLoggedUserContext();
  if (!loggedUserData) return;
  return (
    <div className="flex w-[300px] flex-col items-center gap-16 font-roboto sm:w-[320px] lg:w-[660px] xl:w-[984px] 2xl:w-[1316px]">
      <div className="flex w-full flex-col justify-between gap-4 lg:gap-12 xl:flex-row">
        <UserCard
          editButton
          user={loggedUserData}
          styles="lg:grid-cols-10 max-h-[110px] min-w-0"
          onClick={() => 1}
        >
          <h1 className="col-span-4 col-start-3 row-start-1 flex items-center gap-2 text-2xl">
            {loggedUserData?.nickname}{" "}
            <span className="relative top-[3px] text-sm opacity-50">
              Punkty:{" "}
              <strong className="text-extras opacity-100">
                {loggedUserData?.points}
              </strong>
            </span>
          </h1>

          <h2 className="relative bottom-8 left-[2px] col-span-4 col-start-3 row-start-2 flex items-center text-xs opacity-50 md:bottom-10">
            <ReactTimeAgo date={loggedUserData.createdAt} locale="pl-PL" />
          </h2>
        </UserCard>
        <Titles />
      </div>

      <PreferencesContainer />
    </div>
  );
};

export default Settings;
