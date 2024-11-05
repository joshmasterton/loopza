import { Navigation } from "./Navigation.component";
import { UserTypes } from "../../types/features/features.types";
import { Button } from "./Button.component";
import axios, { AxiosError } from "axios";
import { API_URL } from "../utilities/request.utilities";
import { withUserCheck } from "../utilities/Protected.utilities";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./Loading.component";
import { TiGroupOutline } from "react-icons/ti";
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";

export const User = ({
  profile,
  type,
}: {
  profile: UserTypes;
  type: "component" | "page";
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentUser, setCurrentUser] = useState(profile);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const getUser = async () => {
    try {
      const getUserResponse = await axios.get(`${API_URL}/user/get`, {
        params: {
          userId: currentUser.id,
          requesterId: user?.id,
        },
      });

      if (getUserResponse.data) setCurrentUser(getUserResponse.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, [user]);

  const followUser = async () => {
    setLoadingFollow(true);

    try {
      const response = await axios.post(
        `${API_URL}/user/follow`,
        {
          follower_two_id: profile.id,
        },
        { withCredentials: true }
      );

      if (response.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      setLoadingFollow(false);
    }
  };

  const deleteFollowing = async () => {
    setLoadingDelete(true);

    try {
      const response = await axios.post(
        `${API_URL}/user/deleteFollow`,
        {
          follower_two_id: profile.id,
        },
        { withCredentials: true }
      );

      if (response.data) {
        await getUser();
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      setLoadingDelete(false);
    }
  };

  if (type === "component") {
    return (
      <div className="user">
        <Navigation link={`/profile/${currentUser?.id}`} type="button" />
        <header>
          <div>
            <img src={currentUser?.profile_picture_url} alt="" />
          </div>
          <div>
            <div>{currentUser?.username}</div>
            <p>{currentUser?.created_at}</p>
          </div>
        </header>
        <main>
          <Button
            id="followerReact"
            type="button"
            className="padding primary"
            onClick={async () => {
              await withUserCheck(user, dispatch, async () => {
                await followUser();
              });
            }}
          >
            {loadingFollow ? (
              <LoadingSpinner isPrimary />
            ) : (
              <div>
                {currentUser?.is_accepted === null
                  ? "Follow"
                  : currentUser?.is_accepted
                  ? "Followers"
                  : currentUser?.pending_user_id === user?.id
                  ? "Accept"
                  : "Waiting for follow"}
              </div>
            )}
          </Button>
          {currentUser?.is_accepted !== null && (
            <Button
              id="followerReact"
              type="button"
              className="padding primary"
              onClick={async () => {
                await withUserCheck(user, dispatch, async () => {
                  await deleteFollowing();
                });
              }}
            >
              {loadingDelete ? (
                <LoadingSpinner isPrimary />
              ) : (
                <div>Unfollow</div>
              )}
            </Button>
          )}
        </main>
      </div>
    );
  } else if (type === "page") {
    return (
      <div id="profile">
        <header>
          <>
            <img src={profile?.profile_picture_url} alt="" />
            <img src={profile?.profile_picture_url} alt="" />
          </>
          <div>
            <div>{profile?.username}</div>
            <p>{profile?.email}</p>
          </div>
        </header>
        <main>
          <div>
            <TiGroupOutline />
            <div>Followers</div>
            <p>{profile?.followers}</p>
          </div>
          <div>
            <MdOutlineLocalPostOffice />
            <div>Posts</div>
            <p>{profile?.posts}</p>
          </div>
          <div>
            <IoChatbubbleOutline />
            <div>Comments</div>
            <p>{profile?.comments}</p>
          </div>
          <div>
            <FaRegStar />
            <div>Karma</div>
            <p>{(profile?.likes ?? 0) - (profile?.dislikes ?? 0)}</p>
          </div>
        </main>
        <footer>
          <Button
            id="followerReact"
            type="button"
            className="padding primary"
            onClick={async () => {
              await withUserCheck(user, dispatch, async () => {
                await followUser();
              });
            }}
          >
            {loadingFollow ? (
              <LoadingSpinner isPrimary />
            ) : (
              <div>
                {currentUser?.is_accepted === null
                  ? "Follow"
                  : currentUser?.is_accepted
                  ? "Followers"
                  : currentUser?.pending_user_id === user?.id
                  ? "Accept"
                  : "Waiting for follow"}
              </div>
            )}
          </Button>
          {currentUser?.is_accepted !== null && (
            <Button
              id="followerReact"
              type="button"
              className="padding primary"
              onClick={async () => {
                await withUserCheck(user, dispatch, async () => {
                  await deleteFollowing();
                });
              }}
            >
              {loadingDelete ? (
                <LoadingSpinner isPrimary />
              ) : (
                <div>Unfollow</div>
              )}
            </Button>
          )}
        </footer>
      </div>
    );
  }
};
