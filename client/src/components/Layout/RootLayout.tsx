import { Outlet } from "react-router-dom";
import { Navbar } from "../Navigation/Navbar";
import { SearchBar } from "../Navigation/SearchBar";
import { Suspense, useState } from "react";
import Spinner from "../Spinner/Spinner";

const RootLayout = () => {
  const [theme, setTheme] = useState("default");

  return (
    <main
      className={`flex h-screen w-screen flex-col bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-secondary)] md:flex-row theme-${theme}`}
    >
      <Navbar />

      <div className="flex flex-grow flex-col">
        <SearchBar />
        <section className="flex-grow p-4">
          <button onClick={() => setTheme("default")}>Default</button>
          <button onClick={() => setTheme("light")}>Light</button>
          <button onClick={() => setTheme("blue")}>Blue</button>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
