import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export type InputTypes = {
  id: string;
  title?: string;
  type: string;
  register?: UseFormRegisterReturn;
  className?: string;
  placeholder?: string;
  children?: ReactNode;
  isTextArea?: boolean;
  max?: number;
};

export type ButtonTypes = {
  id: string;
  onClick?: () => void;
  className?: string;
  type: "button" | "submit" | "reset" | undefined;
  children: ReactNode;
  disabled?: boolean;
};

export type NavigationTypes = {
  link: string;
  type: "button" | "link";
  children?: ReactNode;
  className?: string;
};
