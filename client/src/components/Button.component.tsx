import { ButtonTypes } from "../../types/components/Components.types";

export const Button = ({ id, type, onClick, children }: ButtonTypes) => {
  return (
    <button id={id} type={type} onClick={onClick}>
      {children}
    </button>
  );
};
