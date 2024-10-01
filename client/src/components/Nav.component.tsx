import { Navigation } from "./Navigation.component";
import { IoMenu } from "react-icons/io5";
import { Button } from "./Button.component";
import { CgLogOut } from "react-icons/cg";
import { HiUsers } from "react-icons/hi";
import { HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { logoutUser } from "../features/authSlice";
import { GoHomeFill } from "react-icons/go";
import { useState } from "react";
import logo from "../assets/loopza.png";

export const Nav = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMenu, setIsMenu] = useState(false);

  return (
    <nav className={isMenu ? "active" : "hidden"}>
      <header>
        <img src={logo} alt="" />
        <h4>LOOPZA</h4>
        <div>
          <Button
            id=""
            className="transparent"
            type="button"
            onClick={() => {
              setIsMenu(!isMenu);
            }}
          >
            <IoMenu />
          </Button>
        </div>
      </header>
      <main>
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
      </main>
    </nav>
  );
};
