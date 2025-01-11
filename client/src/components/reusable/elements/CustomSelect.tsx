import React from "react";

interface CustomSelectProps {
  label: string;
  value: string | number;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  styles?: string;
  color?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  options,
  onChange,
  styles = "w-max",
  color = "secondary",
}) => {
  return (
    <div className="relative flex flex-col">
      <span className="absolute -top-5 left-3 text-[12px] opacity-50">
        {label}
      </span>
      <div className={`shadow-custom-inner bg-${color} w-max rounded-md pr-2`}>
        <select
          className={`h-12 rounded-md bg-transparent px-2 text-sm text-baseText outline-none ${styles}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option, index) => (
            <option key={index} className={`bg-${color}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomSelect;
