import { ButtonTypes } from "../../types/components/Components.types";

export const Button = ({ id, type, children }: ButtonTypes) => {
  return (
    <button id={id} type={type}>
      {children}
    </button>
  );
};
