import { InputTypes } from "../../types/components/Components.types";

export const Input = ({
  id,
  title,
  placeholder,
  type,
  register,
  className,
  children,
  isTextArea,
  max,
}: InputTypes) => {
  return (
    <label
      htmlFor={id}
      className={
        children
          ? `right ${className} ${isTextArea ? "textArea" : ""}`
          : `${className} ${isTextArea ? "textArea" : ""}`
      }
    >
      {title && <p>{title}</p>}
      {isTextArea ? (
        <textarea
          {...register}
          id={id}
          maxLength={max}
          placeholder={placeholder}
        />
      ) : (
        <input
          {...register}
          max={max}
          id={id}
          type={type}
          placeholder={placeholder}
        />
      )}
      {children}
    </label>
  );
};
