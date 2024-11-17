import { RxHamburgerMenu } from "react-icons/rx";
import { GrHome } from "react-icons/gr";
import { GoTrophy } from "react-icons/go";
import { FaRegNewspaper } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuUser2 } from "react-icons/lu";

interface INavItems {
  name: string;
  icon: React.ReactNode;
  path: string;
  border?: boolean;
}

const navItems: INavItems[] = [
  { name: "Strona główna", icon: <GrHome />, path: "" },
  { name: "Ranking", icon: <GoTrophy />, path: "ranking" },
  { name: "Quizy", icon: <FaRegNewspaper />, path: "quizzes", border: true },
  { name: "Logowanie", icon: <LuUser2 />, path: "login" },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState<string>();
  const [showLocations, setShowLocations] = useState<boolean>(true);

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
          {navItems.map((item: INavItems) => (
            <li
              key={item.path}
              className={`${item.border && "border-bottom mb-1"} ${showLocations || "max-w-12"} ${currentLocation === item.path ? "list-item-selected" : ""} relative list-item`}
              onClick={() => changeSubPage(item.path)}
            >
              {item.icon}
              {showLocations && (
                <span className="text-textBase">{item.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
