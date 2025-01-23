type ButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "fill" | "outline";
  styles?: string;
};

export const Button = ({
  onClick,
  children,
  disabled = false,
  type = "button",
  variant = "fill",
  styles = "py-2 px-5 min-h-10",
}: ButtonProps) => {
  const buttonStyles =
    variant === "fill"
      ? " border-extras bg-extras text-primary"
      : " border-baseText text-baseText";

  return (
    <button
      className={`flex items-center justify-center rounded-md border-2 transition-all duration-300 hover:border-extras hover:bg-primary hover:text-extras ${buttonStyles} ${styles}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const EditButton = ({
  onClick,
  label,
}: {
  onClick: () => void;
  label?: string;
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      styles={
        "border-primary text-sm absolute right-0 bg-primary py-0 min-h-8 lg:min-h-10 md:px-5 px-3 mr-2 mt-1"
      }
      onClick={onClick}
    >
      {label || "Edytuj"}
    </Button>
  );
};
