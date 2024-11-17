export const Login = () => {
  return (
    <div className="flex w-[300px] flex-col items-center">
      <h2 className="flex h-16 items-center text-3xl">Zaloguj się</h2>
      <p className="mb-6 text-center text-[10px]">
        Rozwiązuj i tworz Quizy z każdego miejsca na świecie
      </p>

      <form className="inputBox flex flex-col items-center gap-4">
        <div className="relative">
          <input
            className="shadow-custom-inner h-12 w-[250px] rounded-md bg-secondary pl-2 outline-none md:w-[300px]"
            required
            type="text"
          />
          <span className="pointer-events-none absolute left-3 top-[13px] duration-500">
            Login
          </span>
        </div>

        <div className="relative">
          <input
            className="shadow-custom-inner h-12 w-[250px] rounded-md bg-secondary pl-2 outline-none md:w-[300px]"
            required
            type="password"
          />
          <span className="pointer-events-none absolute left-3 top-[13px] duration-500">
            Hasło
          </span>
        </div>
      </form>
    </div>
  );
};
