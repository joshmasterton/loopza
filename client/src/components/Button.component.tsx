import { ButtonTypes } from "../../types/components/Components.types";

export const Button = ({
  id,
  type,
  onClick,
  className,
  children,
  disabled,
}: ButtonTypes) => {
  return (
    <button
      id={id}
      disabled={disabled}
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
