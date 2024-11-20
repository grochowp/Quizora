import { useState } from "react";
import { Button } from "../../components/reusable/Button";
import CustomInput from "../../components/reusable/CustomInput";
import { LuUser2 } from "react-icons/lu";
import { IoLockClosedOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useLoggedUserContext } from "../../contexts/loggedUserContext";
import { loginOrRegister } from "../../services/userService";
import { IFormData } from "../../interfaces";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [selectedAction, setSelectedAction] = useState<string>("login");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [resErrors, setResErrors] = useState<string>("");
  const { register, handleSubmit, reset } = useForm<IFormData>();
  const { setLoggedUserData } = useLoggedUserContext();
  const navigate = useNavigate();

  const onSubmit = async (data: IFormData) => {
    try {
      setResErrors("");
      const response = await loginOrRegister(selectedAction, data);
      navigate("/");
      setLoggedUserData(response);
      reset();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setResErrors(err.response?.data?.message || "Something went wrong");
      } else {
        setResErrors("An unknown error occurred");
      }
    }
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleChangeAction = () => {
    reset();
    setResErrors("");
    setRememberMe(false);
    setSelectedAction(selectedAction === "login" ? "register" : "login");
  };

  return (
    <div className="shadow-custom absolute left-1/2 top-1/2 flex h-[620px] w-[320px] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-xl bg-primary font-poppins text-baseText md:w-[374px]">
      <h1 className="mt-5 flex h-10 items-center gap-1 text-xl">
        <img src="/assets/logo.png" alt="Logo" /> Quizora
      </h1>

      <h2 className="flex h-16 items-center text-3xl">
        {selectedAction === "login" ? "Zaloguj się" : "Zarejestruj się"}
      </h2>
      <p className="mb-6 text-center text-[10px]">
        {selectedAction === "login"
          ? "Rozwiązuj i twórz Quizy z każdego miejsca na świecie"
          : "Utwórz konto aby korzystać z wszystkich funkcji"}
      </p>

      <form
        className="flex h-full w-full flex-col justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="inputBox flex flex-col items-center gap-4">
          <CustomInput
            label="Login"
            icon={<LuUser2 />}
            type="text"
            register={register("login", {
              required: "Login jest wymagany",
            })}
          />

          {selectedAction === "register" && (
            <>
              <CustomInput
                label="Pseudonim"
                icon={<LuUser2 />}
                type="text"
                register={register("nickname", {
                  required: "Pseudonim jest wymagany",
                  value: "",
                })}
              />
              <CustomInput
                label="Email"
                icon={<MdOutlineEmail />}
                type="email"
                register={register("email", {
                  required: "Email jest wymagany",
                })}
              />
            </>
          )}
          <CustomInput
            label="Hasło"
            icon={<IoLockClosedOutline />}
            type="password"
            register={register("password", {
              required: "Hasło jest wymagane",
            })}
          />
          {selectedAction === "register" && (
            <CustomInput
              label="Powtórz hasło"
              icon={<IoLockClosedOutline />}
              type="password"
              register={register("passwordRepeat", {
                required: "Powtórzenie hasłą jest wymagane",
              })}
            />
          )}

          <div className="ml-3 flex w-4/5 gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMe}
            />
            <p className="cursor-pointer" onClick={handleRememberMe}>
              Pamiętaj mnie
            </p>
          </div>
          {resErrors && (
            <p className="text-center text-sm text-red-600">{resErrors}</p>
          )}
        </div>

        <div className="mb-6 flex w-full justify-around">
          <Button variant="outline" type="button" onClick={handleChangeAction}>
            {selectedAction === "login" ? "Rejestracja" : "Logowanie"}
          </Button>
          <Button
            variant="fill"
            type="submit"
            onClick={() => handleSubmit(onSubmit)}
          >
            {selectedAction === "login" ? "Zaloguj" : "Zarejestruj"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
