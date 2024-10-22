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
  isContainer = true,
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
      } ${isContainer ? "container" : ""}`}
    >
      <div>
        <div />
      </div>
    </div>
  );
};
