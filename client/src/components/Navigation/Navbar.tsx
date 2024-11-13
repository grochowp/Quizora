import { RxHamburgerMenu } from "react-icons/rx";
import { GrHome } from "react-icons/gr";
import { GoTrophy } from "react-icons/go";
import { FaRegNewspaper } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState<string>();

  useEffect(() => {
    setCurrentLocation(location.pathname.split("/")[1]);
  }, [location]);

  const changeSubPage = (query: string) => {
    if (!query) navigate("/home");
    navigate(`/${query}`);
  };

  return (
    <nav className="mr-16 hidden w-56 flex-col gap-44 p-4 md:flex">
      <RxHamburgerMenu className="relative left-2 top-2 h-10 w-10 text-[#D9D9D9]" />

      <ul className="flex flex-col gap-3">
        <li
          className={`list-item ${currentLocation === "" ? "list-item-selected" : ""}`}
          onClick={() => changeSubPage("")}
        >
          <GrHome /> <span>Strona główna</span>
        </li>
        <li
          className={`list-item ${currentLocation === "ranking" ? "list-item-selected" : ""}`}
          onClick={() => changeSubPage("ranking")}
        >
          <GoTrophy /> <span>Ranking</span>
        </li>
        <li
          className={`list-item ${currentLocation === "quizzes" ? "list-item-selected" : ""}`}
          onClick={() => changeSubPage("quizzes")}
        >
          <FaRegNewspaper /> <span>Quizy</span>
        </li>
      </ul>
    </nav>
  );
};
