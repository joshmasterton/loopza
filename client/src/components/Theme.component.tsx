import { useDispatch, useSelector } from "react-redux";
import { Button } from "./Button.component";
import { AppDispatch, RootState } from "../store";
import { changeTheme } from "../features/themeSlice";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

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
          {currentTheme === "dark" ? <IoMoonOutline /> : <IoSunnyOutline />}
        </Button>
      </div>
    </div>
  );
};
