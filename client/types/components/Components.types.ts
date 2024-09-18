import { ReactNode } from "react";

export type InputTypes = {
  id: string;
  title: string;
  placeholder: string;
  type: string;
  children?: ReactNode;
};

export type ButtonTypes = {
  id: string;
  children: ReactNode;
  type: "button" | "submit" | "reset" | undefined;
};

export type FormTypes = {
  method: string;
  children: ReactNode;
};
