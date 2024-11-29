export const TopModal = ({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="relative flex h-20 w-[300px] rounded-lg border-l-4 border-extras bg-secondaryNoAlpha font-roboto md:h-24 md:w-[420px]">
      <div className="m-3 flex aspect-square items-center justify-center rounded-full border-[1px] border-baseText p-2 text-2xl md:text-4xl">
        {icon}
      </div>
      <div className="mr-8 flex items-center whitespace-pre-wrap text-sm md:text-base">
        {label}
      </div>
    </div>
  );
};
