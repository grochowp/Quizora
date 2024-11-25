const FullPageSpinner = () => {
  return (
    <div className="absolute flex h-full w-full items-center justify-center">
      <img
        className="w-20 invert filter"
        src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/abfa05c49acf005b8b1e0ef8eb25a67a7057eb20/svg-css/90-ring.svg"
        alt="Loading spinner"
      />
    </div>
  );
};

export default FullPageSpinner;
