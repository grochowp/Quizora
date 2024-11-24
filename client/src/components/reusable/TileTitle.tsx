export const TileTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="relative m-3 mx-6 text-lg after:absolute after:left-0 after:top-[115%] after:h-[1px] after:w-[180px] after:bg-baseText after:opacity-50 md:text-xl">
      {children}
    </h1>
  );
};
