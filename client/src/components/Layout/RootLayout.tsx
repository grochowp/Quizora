import { Outlet } from "react-router-dom";
import { Navbar } from "../Navigation/Navbar";
import { SearchBar } from "../Navigation/SearchBar";
import { Suspense } from "react";
import Spinner from "../Spinner/Spinner";

const RootLayout = () => {
  return (
    <div className="flex h-screen w-screen flex-col bg-gradient-to-br from-[#181818] to-[#0C1622] md:flex-row">
      <Navbar />

      <div className="flex flex-grow flex-col">
        <SearchBar />
        <main className="flex-grow p-4">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
