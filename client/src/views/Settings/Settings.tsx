import { UserCard } from "../../components/reusable/UserCard";
import { useLoggedUserContext } from "../../contexts/LoggedUserContext";
import { Titles } from "./Components/Titles";
import { PreferencesContainer } from "./Components/PreferencesContainer";
import ReactTimeAgo from "react-time-ago";
import { useState } from "react";
import { TileTitle } from "../../components/reusable/TileTitle";
import CustomInput from "../../components/reusable/elements/CustomInput";
import { Button } from "../../components/reusable/elements/Button";

const Settings = () => {
  const { loggedUserData } = useLoggedUserContext();
  const [openModal, setOpenModal] = useState<boolean>(false);
  if (!loggedUserData) return;

  const manageModal = (state: boolean) => {
    setOpenModal(state);
  };

  const handleSave = () => {};
  return (
    <div className="flex w-[300px] flex-col items-center gap-16 font-roboto sm:w-[320px] lg:w-[660px] xl:w-[984px] 2xl:w-[1316px]">
      <div className="flex w-full flex-col justify-between gap-4 lg:gap-12 xl:flex-row">
        <UserCard
          editButton
          user={loggedUserData}
          styles="lg:grid-cols-10 max-h-[110px] min-w-0"
          onClick={() => manageModal(true)}
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

      {openModal && (
        <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-[rgba(2,2,2,0.75)]">
          <div className="relative flex h-max w-[320px] flex-col justify-between rounded-lg border-l-4 border-extras bg-secondaryNoAlpha md:w-[360px]">
            <div className="relative mb-4 flex">
              <TileTitle>Edytuj profil</TileTitle>
            </div>
            <div className="inputBox relative left-6 flex w-max flex-col gap-3 text-xl">
              <CustomInput label="Pseudonim" type="text" />
              <CustomInput label="Email" type="text" />
              <CustomInput label="Hasło" type="text" />
              <CustomInput
                label="Powtórz Hasło"
                type="text"
                styles="h-12 w-[250px] md:w-[300px] mb-6"
              />
            </div>
            <div className="mb-2 ml-6 mr-8 flex justify-between">
              <Button variant="outline" onClick={() => manageModal(false)}>
                Anuluj
              </Button>
              <Button onClick={handleSave}>Zapisz</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
