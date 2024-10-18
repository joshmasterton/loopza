export const LoadingContainer = () => {
  return (
    <div className="loading">
      <LoadingSpinner />
    </div>
  );
};

export const LoadingSpinner = ({
  isPrimary = false,
}: {
  isPrimary?: boolean;
}) => {
  return (
    <svg
      className={`loadingSpinner ${isPrimary ? "primary" : ""}`}
      viewBox="0 0 40 40"
    >
      <path
        className="path"
        strokeDasharray={"7.85rem"}
        strokeLinecap="round"
        strokeWidth={5}
        d="M20,5 C28,5 35,12 35,20 C35,28 28,35 20,35 C12,35 5,28 5,20 C5,12 12,5 20,5 Z"
      />{" "}
    </svg>
  );
};
