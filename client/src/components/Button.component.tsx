import { ButtonTypes } from "../../types/components/Components.types";

export const Button = ({
  id,
  type,
  onClick,
  className,
  children,
}: ButtonTypes) => {
  return (
    <button
      id={id}
      type={type}
      onClick={(e) => {
        e.currentTarget.blur();
        if (onClick) {
          onClick();
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
};
