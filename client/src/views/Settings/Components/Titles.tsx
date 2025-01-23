import { useState } from "react";
import { TileTitle } from "../../../components/reusable/TileTitle";
import { EditButton } from "../../../components/reusable/elements/Button";
import { useLoggedUserContext } from "../../../contexts/LoggedUserContext";
import { editTitles } from "../../../services/userService";
import { useModalContext } from "../../../contexts/ModalContext";
import { TopModal } from "../../../components/reusable/modals/TopModal";
import { CiEdit } from "react-icons/ci";
import { BiError } from "react-icons/bi";
import Spinner from "../../../components/reusable/Spinner";

export const Titles = () => {
  const { loggedUserData, resetUserData } = useLoggedUserContext();
  const { openModal } = useModalContext();
  const [selectedTitles, setSelectedTitles] = useState(
    loggedUserData?.activeTitles || [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const areTitlesDifferent =
    selectedTitles.length !== loggedUserData?.activeTitles?.length ||
    selectedTitles.some(
      (title, index) => title !== loggedUserData?.activeTitles?.[index],
    );

  const editSelectedTitles = (title: string) => {
    setSelectedTitles((prev) => {
      if (prev.includes(title)) {
        return prev.filter((t) => t !== title);
      } else if (selectedTitles.length >= 3) {
        openModal(
          <TopModal
            icon={<BiError />}
            label="Możesz wybrać maksymalnie 3 Tytuły"
          />,
          "top",
          3,
        );
        return [...prev];
      }
      return [...prev, title];
    });
  };

  const saveTitles = async () => {
    try {
      setIsLoading(true);
      const response = await editTitles(selectedTitles);
      openModal(
        <TopModal icon={<CiEdit />} label={response.message} />,
        "top",
        5,
      );

      resetUserData();
    } catch (err) {
      openModal(<TopModal icon={<BiError />} label={err.message} />, "top", 3);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-28 w-full min-w-[300px] max-w-full flex-1 flex-col rounded-lg border-l-4 border-extras bg-secondary text-baseText md:max-w-[1000px]">
      {isLoading && (
        <div className="absolute z-50 h-full w-full bg-secondary">
          <Spinner />
        </div>
      )}
      <div className="relative flex h-max w-full items-center">
        <TileTitle>Wybrane Tytuły - {selectedTitles.length}/3</TileTitle>
        {areTitlesDifferent && (
          <EditButton label="Zapisz" onClick={saveTitles} />
        )}
      </div>
      <div className="my-4 ml-6 flex flex-wrap items-center gap-2 last:mb-12">
        {loggedUserData?.userProfile?.titles.length !== 0 &&
          loggedUserData?.userProfile?.titles.map((title) => (
            <span
              key={title}
              onClick={() => editSelectedTitles(title)}
              className={`rounded-md ${selectedTitles.includes(title) ? "border-extras bg-extras text-primary" : "border-baseText text-baseText"} cursor-pointer border-[1px] px-3 py-[2px] font-roboto text-[14px] transition-all duration-200 md:text-[17px]`}
            >
              {title}
            </span>
          ))}
      </div>
    </div>
  );
};
