export const ButtonFill = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: string;
}) => {
  return (
    <button
      className="rounded-md border-2 border-extras bg-extras px-5 py-2 text-primary transition-all duration-300 hover:border-extras hover:bg-primary hover:text-extras"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
