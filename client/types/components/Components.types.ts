import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export type InputTypes = {
  id: string;
  title: string;
  type: string;
  register?: UseFormRegisterReturn;
  className?: string;
  placeholder?: string;
  children?: ReactNode;
};

export type ButtonTypes = {
  id: string;
  onClick?: () => void;
  type: "button" | "submit" | "reset" | undefined;
  children: ReactNode;
};

export type NavigationTypes = {
  link: string;
  children: ReactNode;
};
