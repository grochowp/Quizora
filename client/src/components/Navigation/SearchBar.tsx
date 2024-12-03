import { useState } from "react";
import { GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const navigate = useNavigate();

  const handleSearchQuiz = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (searchInput.length === 0) return;

    navigate(`/quizzes?title=${searchInput}`);
    setSearchInput("");
  };

  return (
    <header className="z-30 m-0 mb-8 flex h-20 items-center justify-center">
      <div className="fixed left-[50vw] -translate-x-1/2 transform">
        <form className="relative flex" onSubmit={(e) => handleSearchQuiz(e)}>
          <GoSearch className="absolute left-5 top-3 h-6 w-6 text-baseText" />
          <input
            type="text"
            placeholder="Szukaj Quizu"
            className="shadow-custom-inner h-12 w-[460px] max-w-[75vw] rounded-3xl bg-secondary pb-1 pl-14 text-baseText placeholder-baseText"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              className="absolute right-5 top-[11px] cursor-pointer text-baseText"
              onClick={(e) => handleSearchQuiz(e)}
            >
              Szukaj
            </button>
          )}
        </form>
      </div>
    </header>
  );
};
