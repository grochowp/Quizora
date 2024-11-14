import { Quiz } from "../../components/Quiz/Quiz";

const Home = () => {
  return (
    <>
      <div className="flex h-full max-w-[1000px] flex-col">
        <article className="mb-8">
          <h1 className="mb-4 pl-2 font-poppins text-xl tracking-widest text-baseText">
            Popularne
          </h1>
          <div className="flex flex-wrap gap-4">
            <Quiz />
            <Quiz />
            <Quiz />
            <Quiz />
            <Quiz />
            <Quiz />
          </div>
        </article>
        <article className="mb-8">
          <h1 className="mb-4 pl-2 font-poppins text-xl tracking-widest text-baseText">
            Niedawno dodane
          </h1>
          <div className="flex flex-wrap gap-4">
            <Quiz />
            <Quiz />
            <Quiz />
          </div>
        </article>
        <article className="mb-8">
          <h1 className="mb-4 flex gap-8 pl-2 font-poppins text-xl tracking-widest text-baseText">
            <button>Łatwe</button>
            <button>Średnie</button>
            <button>Trudne</button>
          </h1>
          <div className="flex flex-wrap gap-4">
            <Quiz />
            <Quiz />
            <Quiz />
          </div>
        </article>
      </div>
      <div className="flex h-72 w-96 max-w-[30%] rounded-xl border-l-[6px] border-extras bg-secondary opacity-75">
        a
      </div>
    </>
  );
};

export default Home;
