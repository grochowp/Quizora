import { UserCard } from "../../components/reusable/UserCard";
import { useLoggedUserContext } from "../../contexts/loggedUserContext";
import { Titles } from "./Components/Titles";
import { PreferencesContainer } from "./Components/PreferencesContainer";

const Settings = () => {
  const { loggedUserData } = useLoggedUserContext();

  return (
    <div className="justify-centet flex w-[300px] flex-col items-center gap-16 font-roboto sm:w-[320px] lg:w-[660px] xl:w-[984px] 2xl:w-[1316px]">
      <div className="flex w-full flex-col justify-between gap-4 lg:gap-12 xl:flex-row">
        <UserCard editButton user={loggedUserData} styles="">
          <h1 className=""></h1>
        </UserCard>
        <Titles />
      </div>

      <PreferencesContainer />
    </div>
  );
};

export default Settings;

/**
 * <div className="flex h-28 flex-1 flex-col gap-12 font-roboto lg:flex-row">
      <UserCard
        user={loggedUserData}
        styles="grid-rows-12 grid-cols-11 md:grid-rows-12 lg:grid-cols-12 h-28"
      >
        <div className="relative col-span-2 col-start-3 row-start-2 flex flex-col text-2xl">
          <h1 className="text-[17px] opacity-50">Pseudonim</h1>
          <h2 className="absolute top-5 text-[13px] opacity-100">
            {loggedUserData?.nickname}
          </h2>
        </div>
        <div className="relative col-span-2 col-start-3 row-start-6 flex flex-col text-2xl">
          <h1 className="text-[17px] opacity-50">Pseudonim</h1>
          <h2 className="absolute top-5 text-[13px] opacity-100">
            {loggedUserData?.nickname}
          </h2>
        </div>
        <div className="relative col-span-2 col-start-6 row-start-2 flex flex-col text-2xl">
          <h1 className="text-[17px] opacity-50">Pseudonim</h1>
          <h2 className="absolute top-5 text-[13px] opacity-100">
            {loggedUserData?.nickname}
          </h2>
        </div>
        <div className="relative col-span-2 col-start-6 row-start-6 flex flex-col text-2xl">
          <h1 className="text-[17px] opacity-50">Pseudonim</h1>
          <h2 className="absolute top-5 text-[13px] opacity-100">
            {loggedUserData?.nickname}
          </h2>
        </div>
      </UserCard>
      <div className="flex h-28 w-full max-w-[600px] flex-1 flex-col rounded-lg border-l-4 border-extras bg-secondary">
        <div className="flex h-max w-full items-center justify-between">
          <h1 className="m-3 border-b-[1px] text-xl">Wybrane Tytuły</h1>
          <Button
            type="button"
            variant="outline"
            styles={"border-primary bg-primary py-0 h-max mr-2 "}
            onClick={() => 1}
          >
            Edytuj
          </Button>
        </div>
        <div className="ml-4 flex h-full items-center gap-2">
          {loggedUserData?.activeTitles.length !== 0 &&
            loggedUserData?.activeTitles.map((title) => (
              <>
                <span
                  key={title}
                  className="rounded-md bg-extras px-3 py-[2px] font-roboto text-[15px] text-primary"
                >
                  {title}
                </span>
                <span
                  key={title}
                  className="rounded-md bg-extras px-3 py-[2px] font-roboto text-[15px] text-primary"
                >
                  {title}
                </span>
                <span
                  key={title}
                  className="rounded-md bg-extras px-3 py-[2px] font-roboto text-[15px] text-primary"
                >
                  {title}
                </span>
              </>
            ))}
        </div>
      </div>
    </div>
 */
