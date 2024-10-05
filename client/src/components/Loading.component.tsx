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
      <circle cx={20} cy={20} r={18}></circle>
    </svg>
  );
};
