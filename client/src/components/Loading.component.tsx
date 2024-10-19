export const LoadingContainer = ({
  isContainer,
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
}: {
  isPrimary?: boolean;
  isContainer?: boolean;
}) => {
  return (
    <div className={`loadingSpinner ${isPrimary ? "primary" : ""}`}>
      <div>
        <div className={`${isContainer ? "container" : "background"}`} />
      </div>
    </div>
  );
};
