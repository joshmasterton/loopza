import { useForm } from "react-hook-form";
import { Input } from "../components/Input.component";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { UserTypes } from "../../types/features/features.types";
import axios, { AxiosError } from "axios";
import { API_URL } from "../utilities/request.utilities";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../components/User.component";
import { Button } from "../components/Button.component";
import { BiSearch } from "react-icons/bi";
import {
  LoadingContainer,
  LoadingSpinner,
} from "../components/Loading.component";

const searchUsersSchema = yup.object().shape({
  search: yup.string().optional(),
});

export const Followers = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<UserTypes[] | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [isAllUsers, setIsAllUsers] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ search?: string }>({
    mode: "onChange",
    resolver: yupResolver(searchUsersSchema),
  });

  const getUsers = async (
    search?: string,
    page: number = 0,
    isMore: boolean = false,
    isPrevious: boolean = false
  ) => {
    if (isMore || isPrevious) {
      setLoadingMore(true);
    } else {
      setLoadingUsers(true);
    }

    try {
      const response = await axios.get(`${API_URL}/user/gets`, {
        params: {
          type: isAllUsers ? "all" : "followers",
          userId: user?.id,
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
      setLoadingMore(false);
      setLoadingUsers(false);
    }
  };

  const onSubmit = async (data: { search?: string }) => {
    setUsers(undefined);
    await getUsers(data.search, page);
  };

  useEffect(() => {
    setUsers(undefined);
    setPage(0);
    getUsers(undefined, page);
  }, [isAllUsers, user]);

  return (
    <>
      <div id="main" className="followers">
        <header>
          <form method="GET" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="searchUsername"
              type="text"
              register={register("search", { required: true })}
              placeholder={`Search for ${isAllUsers ? "user" : "follower"}...`}
            >
              {errors.search && (
                <div className="error">{errors.search.message}</div>
              )}
            </Input>
            <Button type="submit" id="searchSubmit" className="primary">
              <BiSearch />
            </Button>
          </form>
        </header>
        <div>
          <Button
            id="allUsers"
            type="button"
            className={`${isAllUsers ? "outline" : "primary"} padding`}
            onClick={() => setIsAllUsers(false)}
          >
            <div>Followers</div>
          </Button>
          <Button
            id="allUsers"
            type="button"
            className={`${isAllUsers ? "primary" : "outline"} padding`}
            onClick={() => setIsAllUsers(true)}
          >
            <div>All</div>
          </Button>
        </div>
        {page > 0 && (
          <Button
            type="button"
            id="loadPrevious"
            className="more"
            onClick={async () => {
              await getUsers("", page, false, true);
            }}
          >
            {loadingMore ? <LoadingSpinner /> : <div>Load previous</div>}
          </Button>
        )}
        <main>
          {loadingUsers ? (
            <LoadingContainer />
          ) : (
            <>
              {users &&
                users?.length > 0 &&
                users.map((user) => (
                  <User key={user.id} profile={user} type="component" />
                ))}
              {users && users.length < 3 && <div className="blank"></div>}
              {users === undefined && !loadingUsers && !loadingMore && (
                <div className="blank">{`No ${
                  isAllUsers ? "users" : "followers"
                }`}</div>
              )}
            </>
          )}
        </main>
        {users?.length === 10 && (
          <Button
            type="button"
            id="loadMore"
            className="more"
            onClick={async () => {
              await getUsers("", page, true, false);
            }}
          >
            {loadingMore ? <LoadingSpinner /> : <div>Load more</div>}
          </Button>
        )}
      </div>
    </>
  );
};
