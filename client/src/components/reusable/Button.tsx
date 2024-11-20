type ButtonProps = {
  onClick: () => void;
  children: string;
  type?: "button" | "submit" | "reset";
  variant?: "fill" | "outline";
  styles?: string;
};

export const Button = ({
  onClick,
  children,
  type = "button",
  variant = "fill",
  styles = "py-2",
}: ButtonProps) => {
  const buttonStyles =
    variant === "fill"
      ? " border-extras bg-extras text-primary"
      : " border-baseText text-baseText";

  return (
    <button
      className={`min-h-10 rounded-md border-2 px-5 transition-all duration-300 hover:border-extras hover:bg-primary hover:text-extras ${buttonStyles} ${styles}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
