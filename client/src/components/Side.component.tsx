import { Navigation } from "./Navigation.component";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Button } from "./Button.component";
import { CgLogOut } from "react-icons/cg";
import { logoutUser } from "../features/authSlice";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Theme } from "./Theme.component";
import { LoadingContainer, LoadingSpinner } from "./Loading.component";
import { MdOutlineCreate } from "react-icons/md";
import { TiGroupOutline, TiUserOutline } from "react-icons/ti";
import { TbBuildingArch } from "react-icons/tb";
import { withUserCheck } from "../utilities/Protected.utilities";
import axios, { AxiosError } from "axios";
import { API_URL } from "../utilities/request.utilities";
import { UserTypes } from "../../types/features/features.types";
import { User } from "./User.component";

export const Side = () => {
  const [page, setPage] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<UserTypes[] | undefined>(undefined);
  const { user, status } = useSelector((state: RootState) => state.auth);
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

  useEffect(() => {
    setUsers(undefined);
    setPage(0);
    getUsers(undefined, page);
  }, [user]);

  const getUsers = async (
    search?: string,
    page: number = 0,
    isMore: boolean = false,
    isPrevious: boolean = false
  ) => {
    setLoadingUsers(true);

    try {
      const response = await axios.get(`${API_URL}/user/gets`, {
        params: {
          type: "all",
          userId: user?.id,
          getOnlineUsers: true,
          filter: "likes",
          search,
          page: isMore ? page + 1 : isPrevious ? Math.max(0, page - 1) : 0,
        },
      });

      if (response.data.length > 0 && isMore) {
        setPage(page + 1);
      } else if (isPrevious) {
        setPage(Math.max(0, page - 1));
      }

      if (response.data.length > 0) {
        setUsers(response.data);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="side">
      <div className="menu">
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
      </div>
      <div className="users">
        <main>
          {/* {page > 0 && (
            <Button
              type="button"
              id="loadPrevious"
              className="container more"
              onClick={async () => {
                await getUsers("", page, false, true);
              }}
            >
              {loadingMore ? <LoadingSpinner /> : <div>Load previous</div>}
            </Button>
          )} */}
          {loadingUsers ? (
            <LoadingContainer />
          ) : (
            <>
              {users &&
                users?.length > 0 &&
                users.map((user) => (
                  <User key={user.id} profile={user} type="component" isSide />
                ))}
              {(users && users.length < 3) ||
                (users === undefined && <div className="blank" />)}
            </>
          )}
          {/* {users?.length === 10 && (
            <Button
              type="button"
              id="loadMore"
              className="container more"
              onClick={async () => {
                await getUsers("", page, true, false);
              }}
            >
              {loadingMore ? <LoadingSpinner /> : <div>Load more</div>}
            </Button>
          )} */}
        </main>
      </div>
    </div>
  );
};
