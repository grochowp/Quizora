import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface FormInputProps {
  label: string;
  type: string;
  icon: React.ReactNode;
  register: UseFormRegisterReturn;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  icon,
  register,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative">
      <input
        className="shadow-custom-inner h-12 w-[250px] rounded-md bg-secondary pl-2 outline-none md:w-[300px]"
        required
        type={type === "password" && !isPasswordVisible ? "password" : "text"}
        {...register}
      />
      <span className="pointer-events-none absolute left-3 top-[13px] flex items-center gap-2 opacity-50 duration-500">
        {icon}
        {label}
      </span>
      {type === "password" && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 transform opacity-50 hover:opacity-100"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? <FiEye /> : <FiEyeOff />}
        </button>
      )}
    </div>
  );
};

export default FormInput;
