import { useState } from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ButtonEmpty } from "../../components/Button/ButtonEmpty";
import { ButtonFill } from "../../components/Button/ButtonFill";

const LoginPage = () => {
  const [selectedAction, setSelectedAction] = useState<string>("login");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  console.log(rememberMe);
  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  const handleChangeAction = () => {
    setSelectedAction(selectedAction === "login" ? "register" : "login");
  };

  return (
    <div className="shadow-custom absolute left-1/2 top-1/2 h-[600px] w-[300px] -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-primary font-poppins sm:w-[374px]">
      <div className="flex h-5/6 flex-col items-center">
        <h1 className="mt-5 flex h-10 items-center gap-1 text-xl">
          <img src="/assets/logo.png" /> Quizora
        </h1>

        {selectedAction === "login" ? <Login /> : <Register />}
        <div className="ml-3 mt-3 flex w-4/5 gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={handleRememberMe}
          />
          <span>Pamiętaj mnie</span>
        </div>
      </div>
      <div className="flex h-1/6 items-center justify-around">
        <ButtonEmpty onClick={handleChangeAction}>
          {selectedAction === "login" ? "Rejestracja" : "Logowanie"}
        </ButtonEmpty>
        <ButtonFill onClick={() => 1}>
          {selectedAction === "login" ? "Zaloguj" : "Zarejestruj"}
        </ButtonFill>
      </div>
    </div>
  );
};

export default LoginPage;
