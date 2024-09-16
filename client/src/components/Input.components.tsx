import { InputTypes } from "../../types/components/Components.types";

export const Input = ({ id, title, placeholder }: InputTypes) => {
  return (
    <label htmlFor={id}>
      {title}
      <input id={id} placeholder={placeholder} />
    </label>
  );
};
