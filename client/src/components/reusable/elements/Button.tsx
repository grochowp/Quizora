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
  styles = "py-2 px-5 min-h-10",
}: ButtonProps) => {
  const buttonStyles =
    variant === "fill"
      ? " border-extras bg-extras text-primary"
      : " border-baseText text-baseText";

  return (
    <button
      className={`rounded-md border-2 transition-all duration-300 hover:border-extras hover:bg-primary hover:text-extras ${buttonStyles} ${styles}`}
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
      styles={
        "border-primary text-sm absolute right-0 bg-primary py-0 min-h-8 lg:min-h-10 md:px-5 px-3 mr-2 mt-1"
      }
      onClick={onClick}
    >
      Edytuj
    </Button>
  );
};
