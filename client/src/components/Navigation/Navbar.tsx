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
    if (!query) navigate("/");
    navigate(`/${query}`);
  };

  return (
    <nav className="mr-5 hidden min-w-56 p-4 md:flex">
      <div className="fixed flex flex-col gap-28">
        <RxHamburgerMenu
          className="relative left-[6px] top-2 h-10 w-10 cursor-pointer text-baseText"
          onClick={() => setShowLocations(!showLocations)}
        />

        <ul className="flex flex-col gap-3">
          {navItems.map((item: INavItems) => (
            <li
              key={item.path}
              className={`${showLocations || "list-item-short"} ${currentLocation === item.path ? "list-item-selected list-item" : "list-item"}`}
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
