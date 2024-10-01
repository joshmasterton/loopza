import { GoHomeFill } from "react-icons/go";
import { Navigation } from "./Navigation.component";
import { HiUser, HiUsers } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Button } from "./Button.component";
import { CgLogOut } from "react-icons/cg";
import { logoutUser } from "../features/authSlice";

export const Side = ({ type }: { type: "left" | "right" }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className={`side ${type}`}>
      <div>
        {type === "left" ? (
          <ul>
            <Navigation link="/login" type="button">
              {user ? (
                <>
                  <img src={user.profile_picture_url} alt="" />
                  <div>{user.username}</div>
                </>
              ) : (
                <>
                  <HiUser />
                  <div>Login</div>
                </>
              )}
            </Navigation>

            <Navigation link="/" type="button">
              <GoHomeFill />
              <div>Home</div>
            </Navigation>
            <Navigation link="/" type="button">
              <HiUsers />
              <div>Followers</div>
            </Navigation>
            <Button
              type="button"
              id="logout"
              className="transparent"
              onClick={() => {
                dispatch(logoutUser());
              }}
            >
              <CgLogOut />
              <div>Logout</div>
            </Button>
          </ul>
        ) : (
          <ul>
            <Navigation link="/login" type="button">
              {user ? (
                <>
                  <img src={user.profile_picture_url} alt="" />
                  <div>{user.username}</div>
                </>
              ) : (
                <>
                  <HiUser />
                  <div>Login</div>
                </>
              )}
            </Navigation>
            <Navigation link="/" type="button">
              <GoHomeFill />
              <div>Home</div>
            </Navigation>
            <Navigation link="/" type="button">
              <HiUsers />
              <div>Followers</div>
            </Navigation>
            <Button
              type="button"
              id="logout"
              className="transparent"
              onClick={() => {
                dispatch(logoutUser());
              }}
            >
              <CgLogOut />
              <div>Logout</div>
            </Button>
          </ul>
        )}
      </div>
    </div>
  );
};
