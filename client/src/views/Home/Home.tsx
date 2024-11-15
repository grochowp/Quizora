import { Quiz } from "../../components/Quiz/Quiz";
import { useLoaderData } from "react-router-dom";
import { IQuiz } from "../../interfaces";

interface HomeLoaderData {
  popular: IQuiz[];
  recently: IQuiz[];
  difficulty: IQuiz[];
}

const Home = () => {
  const { popular, recently, difficulty } = useLoaderData() as HomeLoaderData;
  return (
    <>
      <div className="flex h-full max-w-[1000px] flex-col">
        <article className="mb-8">
          <h1 className="mb-3 pl-2 font-poppins text-xl tracking-widest text-baseText">
            Popularne
          </h1>

          <div className="flex flex-wrap gap-4">
            {popular.map((quiz: IQuiz) => (
              <>
                <Quiz quiz={quiz} />
                <Quiz quiz={quiz} />
                <Quiz quiz={quiz} />
              </>
            ))}
          </div>
        </article>
        <article className="mb-8">
          <h1 className="mb-3 pl-2 font-poppins text-xl tracking-widest text-baseText">
            Niedawno dodane
          </h1>
          <div className="flex flex-wrap gap-4">
            {recently.map((quiz: IQuiz) => (
              <Quiz quiz={quiz} />
            ))}
          </div>
        </article>
        <article className="mb-8">
          <h1 className="mb-3 flex gap-8 pl-2 font-poppins text-xl tracking-widest text-baseText">
            <button>Łatwe</button>
            <button>Średnie</button>
            <button>Trudne</button>
          </h1>
          <div className="flex flex-wrap gap-4">
            {difficulty.map((quiz: IQuiz) => (
              <Quiz quiz={quiz} />
            ))}
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
