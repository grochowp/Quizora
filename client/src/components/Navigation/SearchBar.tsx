import { GoSearch } from "react-icons/go";

export const SearchBar = () => {
  return (
    <header className="m-0 mb-16 flex h-20 items-center justify-center">
      <div className="absolute left-1/2 -translate-x-1/2 transform">
        <div className="relative flex">
          <GoSearch className="absolute left-5 top-3 h-6 w-6 text-[#D9D9D9]" />
          <input
            type="text"
            placeholder="Szukaj Quizu"
            className="shadow-custom-inner h-12 w-[460px] max-w-[75vw] rounded-3xl bg-[#212121] pb-1 pl-14 text-[#D9D9D9]"
          ></input>
        </div>
      </div>
    </header>
  );
};
