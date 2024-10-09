import { Navigation } from "./Navigation.component";
import { IoChevronBack, IoClose, IoCreate, IoMenu } from "react-icons/io5";
import { Button } from "./Button.component";
import { CgLogOut } from "react-icons/cg";
import { HiUsers } from "react-icons/hi";
import { HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { logoutUser } from "../features/authSlice";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { Theme } from "./Theme.component";
import { useLocation } from "react-router-dom";
import logo from "../assets/loopza.png";
import logoDark from "../assets/loopza_dark.png";

export const Nav = ({ isReturn = false }: { isReturn?: boolean }) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState<string | undefined>(undefined);
  const [isMenu, setIsMenu] = useState(false);
  const { user, status } = useSelector((state: RootState) => state.auth);
  const { currentTheme } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    if (currentPath === "") {
      setCurrentPage("home");
    } else {
      setCurrentPage(currentPath);
    }
  }, [location]);

  const handleScroll = () => {
    setIsMenu(false);
  };

  useEffect(() => {
    setIsMenu(false);
  }, [location]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={isMenu ? "active" : "hidden"}>
      <header>
        {isReturn ? (
          <Navigation link="/" type="button">
            <IoChevronBack />
          </Navigation>
        ) : (
          <img src={currentTheme === "dark" ? logo : logoDark} alt="" />
        )}
        <div>
          <Button
            id=""
            className="transparent"
            type="button"
            onClick={() => {
              setIsMenu(!isMenu);
            }}
          >
            {isMenu ? <IoClose /> : <IoMenu />}
          </Button>
        </div>
      </header>
      <main>
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
          <Navigation link="/newPost" type="button">
            <IoCreate />
            <div>New post</div>
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
            {status === "loading" ? <div>Loading</div> : <div>Logout</div>}
          </Button>
          <Theme />
        </ul>
      </main>
    </nav>
  );
};
