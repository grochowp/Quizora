import React from "react";

interface CustomSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  styles?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  options,
  onChange,
  styles = "",
}) => {
  return (
    <div className="relative flex flex-col">
      <span className="absolute -top-5 left-3 text-[12px] opacity-50">
        {label}
      </span>
      <select
        className={`shadow-custom-inner h-12 w-max rounded-md bg-secondary px-2 text-sm ${styles}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
