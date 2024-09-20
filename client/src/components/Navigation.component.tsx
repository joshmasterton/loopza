import { Link } from "react-router-dom";
import { NavigationTypes } from "../../types/components/Components.types";

export const Navigation = ({ link, children }: NavigationTypes) => {
  return (
    <Link to={link} onClick={(e) => e.currentTarget.blur()}>
      {children}
    </Link>
  );
};
