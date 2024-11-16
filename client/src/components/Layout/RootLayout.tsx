import { Outlet } from "react-router-dom";
import { Navbar } from "../Navigation/Navbar";
import { SearchBar } from "../Navigation/SearchBar";
import { Suspense, useState } from "react";
import Spinner from "../Spinner/Spinner";

const RootLayout = () => {
  const [theme] = useState("default");

  return (
    <>
      <main
        className={`flex min-h-screen flex-col bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-secondary)] md:flex-row theme-${theme}`}
      >
        <Navbar />
        <div className="ml-0 flex flex-grow flex-col items-center justify-center">
          <SearchBar />
          <section className="z-10 flex max-w-[1600px] flex-1">
            <Suspense fallback={<Spinner />}>
              <Outlet />
            </Suspense>
          </section>
        </div>
      </main>
      <img
        src="/assets/book-left.png"
        className="fixed left-1/2 top-1/2 z-0 translate-x-[-850px] translate-y-[200px]"
      />
      <img
        src="/assets/book-right.png"
        className="fixed left-1/2 top-1/2 z-0 translate-x-[500px] translate-y-[200px]"
      />
    </>
  );
};

export default RootLayout;
