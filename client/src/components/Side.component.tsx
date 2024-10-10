import { GoHomeFill } from "react-icons/go";
import { Navigation } from "./Navigation.component";
import { HiUser, HiUsers } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Button } from "./Button.component";
import { CgLogOut } from "react-icons/cg";
import { logoutUser } from "../features/authSlice";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Theme } from "./Theme.component";
import { IoCreate } from "react-icons/io5";
import { LoadingSpinner } from "./Loading.component";
import { showPopup } from "../features/popupSlice";

export const Side = ({ type }: { type: "left" | "right" }) => {
  const { user, status } = useSelector((state: RootState) => state.auth);
  const [currentPage, setCurrentPage] = useState<string | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
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
              <Navigation link={`/profile/${user.username}`} type="button">
                <img src={user.profile_picture_url} alt="" />
                <div>{user.username}</div>
              </Navigation>
            ) : (
              <Navigation link="/login" type="button">
                <HiUser />
                <div>Login</div>
              </Navigation>
            )}
            <Navigation link="/" type="button">
              <GoHomeFill />
              <div>Home</div>
            </Navigation>
            <Navigation link="/following" type="button">
              <HiUsers />
              <div>Following</div>
            </Navigation>
            <Button
              type="button"
              className="transparent"
              id="newPost"
              onClick={() => {
                if (user) {
                  navigate("/newPost");
                } else {
                  dispatch(
                    showPopup({
                      messages: ["Please login to use this feature"],
                    })
                  );
                }
              }}
            >
              <IoCreate />
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
              {status === "loading" ? <div>Loading</div> : <div>Logout</div>}
            </Button>
            <Theme />
          </ul>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};
