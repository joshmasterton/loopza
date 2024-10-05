import { useDispatch, useSelector } from "react-redux";
import { Button } from "./Button.component";
import { AppDispatch, RootState } from "../store";
import { BiSolidMoon } from "react-icons/bi";
import { BsSunFill } from "react-icons/bs";
import { changeTheme } from "../features/themeSlice";

export const Theme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTheme } = useSelector((state: RootState) => state.theme);

  return (
    <div id="theme">
      <div>
        <Button
          id="themeButton"
          className={currentTheme}
          type="button"
          onClick={() => dispatch(changeTheme(currentTheme))}
        >
          {currentTheme === "dark" ? <BiSolidMoon /> : <BsSunFill />}
        </Button>
      </div>
    </div>
  );
};
