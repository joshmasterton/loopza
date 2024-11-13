import { Navigation } from "./Navigation.component";
import { IoArrowBack, IoClose, IoMenu } from "react-icons/io5";
import { Button } from "./Button.component";
import { CgLogOut } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { logoutUser } from "../features/authSlice";
import { useEffect, useState } from "react";
import { Theme } from "./Theme.component";
import { useLocation, useNavigate } from "react-router-dom";
import { TbBuildingArch } from "react-icons/tb";
import { TiGroupOutline, TiUserOutline } from "react-icons/ti";
import { MdOutlineCreate } from "react-icons/md";
import { LoadingSpinner } from "./Loading.component";
import { withUserCheck } from "../utilities/Protected.utilities";
import logo from "../assets/loopza.png";

export const Nav = ({ isReturn = false }: { isReturn?: boolean }) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<string | undefined>(undefined);
  const [isMenu, setIsMenu] = useState(false);
  const { user, status } = useSelector((state: RootState) => state.auth);

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
          <Navigation link="/" type="button" className="background">
            <IoArrowBack />
          </Navigation>
        ) : (
          <>
            {user ? (
              <Navigation
                link={`/profile/${user.id}`}
                type="button"
                className="background"
              >
                <img src={user.profile_picture_url} alt="" />
              </Navigation>
            ) : (
              <Navigation link="/login" type="button" className="background">
                <img src={logo} className="logo" />
              </Navigation>
            )}
          </>
        )}
        <h5>
          {currentPage &&
            currentPage.slice(0, 1).toUpperCase() + currentPage?.slice(1)}
        </h5>
        <div>
          <Button
            id=""
            className="background"
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
              setIsMenu(!isMenu);
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
      </main>
    </nav>
  );
};
