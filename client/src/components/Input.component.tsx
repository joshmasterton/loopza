import { InputTypes } from "../../types/components/Components.types";

export const Input = ({
  id,
  title,
  placeholder,
  type,
  children,
}: InputTypes) => {
  return (
    <label htmlFor={id} className={children ? "right" : undefined}>
      {title}
      <input id={id} type={type} placeholder={placeholder} />
      {children}
    </label>
  );
};
