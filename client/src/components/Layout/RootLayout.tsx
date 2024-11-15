import { Outlet } from "react-router-dom";
import { Navbar } from "../Navigation/Navbar";
import { SearchBar } from "../Navigation/SearchBar";
import { Suspense, useState } from "react";
import Spinner from "../Spinner/Spinner";

const RootLayout = () => {
  const [theme, setTheme] = useState("default");

  return (
    <main
      className={`flex min-h-screen flex-col bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-secondary)] md:flex-row theme-${theme}`}
    >
      <Navbar />

      <div className="ml-2 flex flex-grow flex-col">
        <SearchBar />
        <section className="flex max-w-[85vw] flex-1">
          <div className="flex h-full w-full max-w-[85vw] justify-center">
            <div className="flex h-[max-content] w-full max-w-[1600px] flex-wrap justify-center gap-10">
              <Suspense fallback={<Spinner />}>
                <Outlet />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
