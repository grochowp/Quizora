type ButtonProps = {
  onClick: () => void;
  children: string;
  type?: "button" | "submit" | "reset";
  variant?: "fill" | "outline";
};

export const Button = ({
  onClick,
  children,
  type = "button",
  variant = "fill",
}: ButtonProps) => {
  const buttonStyles =
    variant === "fill"
      ? "rounded-md border-2 border-extras bg-extras px-5 py-2 text-primary transition-all duration-300 hover:border-extras hover:bg-primary hover:text-extras"
      : "rounded-md border-2 border-baseText px-5 py-2 text-baseText transition-all duration-300 hover:border-extras hover:bg-primary hover:text-extras";

  return (
    <button className={buttonStyles} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
