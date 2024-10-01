import { Link } from "react-router-dom";
import { NavigationTypes } from "../../types/components/Components.types";

export const Navigation = ({ link, type, children }: NavigationTypes) => {
  return (
    <Link to={link} className={type} onClick={(e) => e.currentTarget.blur()}>
      {children}
    </Link>
  );
};
