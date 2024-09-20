import { InputTypes } from "../../types/components/Components.types";

export const Input = ({
  id,
  title,
  placeholder,
  type,
  register,
  className,
  children,
}: InputTypes) => {
  return (
    <label htmlFor={id} className={children ? `right ${className}` : className}>
      <p>{title}</p>
      <input {...register} id={id} type={type} placeholder={placeholder} />
      {children}
    </label>
  );
};
