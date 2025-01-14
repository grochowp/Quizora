import { forwardRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface CustomInputProps {
  label: string;
  type: string;
  icon?: React.ReactNode;
  register?: UseFormRegisterReturn;
  color?: string;
  required?: boolean;
  styles?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      type,
      icon,
      register,
      color = "secondary",
      styles = "h-12 w-[250px] md:w-[300px]",
      required = true,
      value,
      onChange,
    },
    ref,
  ) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setPasswordVisible(!isPasswordVisible);
    };

    return (
      <div className="relative">
        <input
          className={`shadow-custom-inner rounded-md bg-${color} pl-2 outline-none ${styles}`}
          required={required}
          type={type === "password" && !isPasswordVisible ? "password" : "text"}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          {...register}
          ref={(el) => {
            if (typeof ref === "function") ref(el);
            else if (ref)
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                el;
            if (register?.ref) register.ref(el);
          }}
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
  },
);

export default CustomInput;
