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

export const EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="button"
      variant="outline"
      styles={"border-primary absolute right-0 bg-primary py-0 h-max mr-2 mt-2"}
      onClick={onClick}
    >
      Edytuj
    </Button>
  );
};
