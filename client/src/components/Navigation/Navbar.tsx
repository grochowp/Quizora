import { RxHamburgerMenu } from "react-icons/rx";
import { GrHome } from "react-icons/gr";
import { GoTrophy } from "react-icons/go";
import { FaRegNewspaper } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface INavItems {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: INavItems[] = [
  { name: "Strona główna", icon: <GrHome />, path: "" },
  { name: "Ranking", icon: <GoTrophy />, path: "ranking" },
  { name: "Quizy", icon: <FaRegNewspaper />, path: "quizzes" },
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
    if (!query) navigate("/home");
    navigate(`/${query}`);
  };

  return (
    <nav className="mr-16 hidden w-56 flex-col gap-44 p-4 md:flex">
      <RxHamburgerMenu
        className="text-baseText relative left-2 top-2 h-10 w-10 cursor-pointer"
        onClick={() => setShowLocations(!showLocations)}
      />

      <ul className="flex flex-col gap-3">
        {navItems.map((item: INavItems) => (
          <li
            key={item.path}
            className={` ${showLocations || "list-item-short"} ${currentLocation === item.path ? "list-item-selected list-item" : "list-item"}`}
            onClick={() => changeSubPage(item.path)}
          >
            {item.icon}{" "}
            {showLocations && (
              <span className="text-textBase">{item.name}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
