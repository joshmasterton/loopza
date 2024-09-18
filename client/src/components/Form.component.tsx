import { FormTypes } from "../../types/components/Components.types";

export const Form = ({ method, children }: FormTypes) => {
  return <form method={method}>{children}</form>;
};
