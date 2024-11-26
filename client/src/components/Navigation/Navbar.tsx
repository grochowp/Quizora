import { RxHamburgerMenu } from "react-icons/rx";
import { GrHome } from "react-icons/gr";
import { GoTrophy } from "react-icons/go";
import { FaRegNewspaper } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuUser2 } from "react-icons/lu";
import { useLoggedUserContext } from "../../contexts/LoggedUserContext";
import { MdOutlineQueryStats } from "react-icons/md";
import { MdOutlineAddchart } from "react-icons/md";
import { IoTrophyOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";

interface INavItems {
  name: string;
  icon: React.ReactNode;
  path: string;
  border?: boolean;
  onlyLogged?: boolean;
}

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState<string>();
  const [showLocations, setShowLocations] = useState<boolean>(false);
  const { loggedUserData, logoutUser } = useLoggedUserContext();

  const navItems: INavItems[] = [
    { name: "Strona główna", icon: <GrHome />, path: "" },
    { name: "Ranking", icon: <GoTrophy />, path: "ranking" },
    { name: "Quizy", icon: <FaRegNewspaper />, path: "quizzes", border: true },
    { name: "Logowanie", icon: <LuUser2 />, path: "login", onlyLogged: false },
    {
      name: "Profil",
      icon: <LuUser2 />,
      path: `profile/${loggedUserData?._id}`,
      onlyLogged: true,
    },
    {
      name: "Statystyki",
      icon: <MdOutlineQueryStats />,
      path: "stats",
      onlyLogged: true,
    },
    {
      name: "Dodaj Quiz",
      icon: <MdOutlineAddchart />,
      path: "addQuiz",
      onlyLogged: true,
    },
    {
      name: "Osiągnięcia",
      icon: <IoTrophyOutline />,
      path: "achievements",
      onlyLogged: true,
    },
    {
      name: "Ustawienia",
      icon: <CiSettings />,
      path: "settings",
      onlyLogged: true,
      border: true,
    },
  ];

  useEffect(() => {
    setCurrentLocation(location.pathname.split("/")[1]);
  }, [location]);

  const changeSubPage = (query: string) => {
    if (!query) navigate("/");
    navigate(`/${query}`);
  };

  return (
    <nav
      className={`mr-5 hidden pl-4 pt-4 md:flex ${
        showLocations ? "w-[200px]" : "w-[100px]"
      } transition-width duration-300`}
    >
      <div className="fixed flex flex-col gap-28">
        <RxHamburgerMenu
          className="relative left-[6px] top-2 h-10 w-10 cursor-pointer text-baseText"
          onClick={() => setShowLocations(!showLocations)}
        />

        <ul className="flex flex-col gap-3">
          {navItems
            .filter((item) => {
              // Show item if:
              // 1. `onlyLogged` is `undefined` (always visible)
              // 2. `onlyLogged` is `true` and `loggedUserData` is present
              // 3. `onlyLogged` is `false` and `loggedUserData` is absent
              if (item.onlyLogged === undefined) return true;
              if (item.onlyLogged && loggedUserData) return true;
              if (!item.onlyLogged && !loggedUserData) return true;
              return false;
            })
            .map((item) => (
              <li
                key={item.path}
                className={`${item.border ? "border-bottom mb-1" : ""} ${
                  showLocations ? "" : "max-w-12"
                } ${
                  currentLocation === item.path.split("/")[0]
                    ? "list-item-selected"
                    : ""
                } relative list-item`}
                onClick={() => changeSubPage(item.path)}
              >
                {item.icon}
                {showLocations && (
                  <span className="text-textBase">{item.name}</span>
                )}
              </li>
            ))}
          {loggedUserData && (
            <li
              key="logout"
              className={`${showLocations ? "" : "max-w-12"} relative list-item`}
              onClick={logoutUser}
            >
              <AiOutlineLogout />
              {showLocations && (
                <span className="text-textBase">Wyloguj się</span>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
