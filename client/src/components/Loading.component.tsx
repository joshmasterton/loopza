export const LoadingContainer = ({
  isContainer = true,
}: {
  isContainer?: boolean;
}) => {
  return (
    <div className="loading">
      <LoadingSpinner isContainer={isContainer} />
    </div>
  );
};

export const LoadingSpinner = ({
  isPrimary = false,
  isContainer,
  isSmall = false,
}: {
  isPrimary?: boolean;
  isContainer?: boolean;
  isSmall?: boolean;
}) => {
  return (
    <div
      className={`loadingSpinner ${isPrimary ? "primary" : ""} ${
        isSmall ? "small" : ""
      }`}
    >
      <svg viewBox="0 0 100 100">
        <circle
          r={50}
          cy={50}
          cx={50}
          className={isContainer ? "container" : "background"}
        />
      </svg>
    </div>
  );
};
