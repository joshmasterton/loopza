import { Navigation } from "./Navigation.component";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Button } from "./Button.component";
import { CgLogOut } from "react-icons/cg";
import { logoutUser } from "../features/authSlice";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Theme } from "./Theme.component";
import { LoadingSpinner } from "./Loading.component";
import { MdOutlineCreate } from "react-icons/md";
import { TiGroupOutline, TiUserOutline } from "react-icons/ti";
import { TbBuildingArch } from "react-icons/tb";
import { withUserCheck } from "../utilities/Protected.utilities";
import logo from "../assets/loopza.png";
import logo_dark from "../assets/loopza_dark.png";

export const Side = ({ type }: { type: "left" | "right" }) => {
  const { user, status } = useSelector((state: RootState) => state.auth);
  const { currentTheme } = useSelector((state: RootState) => state.theme);
  const [currentPage, setCurrentPage] = useState<string | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let currentPath: string | undefined;

    if (location.pathname.split("/").length > 2) {
      currentPath = location.pathname.split("/").splice(0, 2).pop();
    } else {
      currentPath = location.pathname.split("/").pop();
    }

    if (currentPath === "") {
      setCurrentPage("home");
    } else {
      setCurrentPage(currentPath);
    }
  }, [location]);

  return (
    <div className={`side ${type}`}>
      <div>
        {type === "left" ? (
          <ul>
            <div className={`hover ${currentPage}`} />
            {user ? (
              <Navigation link={`/profile/${user.id}`} type="button">
                <img src={user.profile_picture_url} alt="" />
                <div>{user.username}</div>
              </Navigation>
            ) : (
              <Navigation link="/login" type="button">
                <TiUserOutline />
                <div>Login</div>
              </Navigation>
            )}
            <Navigation link="/" type="button">
              <TbBuildingArch />
              <div>Home</div>
            </Navigation>
            <Navigation link="/followers" type="button">
              <TiGroupOutline />
              <div>Followers</div>
            </Navigation>
            <Button
              type="button"
              className="transparent"
              id="newPost"
              onClick={async () => {
                await withUserCheck(user, dispatch, () => {
                  navigate("/new");
                });
              }}
            >
              <MdOutlineCreate />
              <div>New post</div>
            </Button>
            <Button
              type="button"
              id="logout"
              className="transparent"
              onClick={() => {
                dispatch(logoutUser());
              }}
            >
              <CgLogOut />
              {status === "loading" ? <LoadingSpinner /> : <div>Logout</div>}
            </Button>
            <Theme />
          </ul>
        ) : (
          <>
            <img src={currentTheme === "dark" ? logo : logo_dark} alt="logo" />
          </>
        )}
      </div>
    </div>
  );
};
