import { UserCard } from "../../components/reusable/UserCard";
import { useLoggedUserContext } from "../../contexts/LoggedUserContext";
import { Titles } from "./Components/Titles";
import { PreferencesContainer } from "./Components/PreferencesContainer";

const Settings = () => {
  const { loggedUserData } = useLoggedUserContext();

  return (
    <div className="flex w-[300px] flex-col items-center gap-16 font-roboto sm:w-[320px] lg:w-[660px] xl:w-[984px] 2xl:w-[1316px]">
      <div className="flex w-full flex-col justify-between gap-4 lg:gap-12 xl:flex-row">
        <UserCard editButton user={loggedUserData} styles="" onClick={() => 1}>
          <h1 className=""></h1>
        </UserCard>
        <Titles />
      </div>

      <PreferencesContainer />
    </div>
  );
};

export default Settings;
