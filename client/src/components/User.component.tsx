import { Navigation } from "./Navigation.component";
import { UserTypes } from "../../types/features/features.types";
import { Button } from "./Button.component";
import axios, { AxiosError } from "axios";
import { API_URL } from "../utilities/request.utilities";
import { withUserCheck } from "../utilities/Protected.utilities";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useState } from "react";

export const User = ({ userItem }: { userItem: UserTypes }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentUser, setCurrentUser] = useState(userItem);
  const dispatch = useDispatch<AppDispatch>();

  const followUser = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/user/follow`,
        {
          follower_two_id: userItem.id,
        },
        { withCredentials: true }
      );

      console.log(response.data);
      if (response.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    }
  };

  const deleteFollowing = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/user/deleteFollow`,
        {
          follower_two_id: userItem.id,
        },
        { withCredentials: true }
      );

      console.log(response.data);
      if (response.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    }
  };

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
          className="padding"
          onClick={async () => {
            await withUserCheck(user, dispatch, async () => {
              await followUser();
            });
          }}
        >
          {currentUser?.is_accepted === null
            ? "Follow"
            : currentUser?.is_accepted
            ? "Followers"
            : userItem.pending_user_id === user?.id
            ? "Accept"
            : "Waiting for response"}
        </Button>
        {currentUser?.is_accepted !== null && (
          <Button
            id="followerReact"
            type="button"
            className="padding"
            onClick={async () => {
              await withUserCheck(user, dispatch, async () => {
                await deleteFollowing();
              });
            }}
          >
            Unfollow
          </Button>
        )}
      </main>
    </div>
  );
};
