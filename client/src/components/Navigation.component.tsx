import { Link } from "react-router-dom";
import { NavigationTypes } from "../../types/components/Components.types";

export const Navigation = ({
  link,
  type,
  children,
  className = "",
}: NavigationTypes) => {
  return (
    <Link
      to={link}
      className={`${type} ${className}`}
      onClick={(e) => e.currentTarget.blur()}
    >
      {children}
    </Link>
  );
};
