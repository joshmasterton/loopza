import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { UserTypes } from "../../types/features/features.types";
import { API_URL } from "../utilities/request.utilities";
import { useLocation } from "react-router-dom";
import { LoadingContainer } from "../components/Loading.component";
import { Button } from "../components/Button.component";

export const Profile = () => {
  const [profile, setProfile] = useState<UserTypes | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const profileId = location.pathname.split("/").pop();

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/user/get`, {
        params: {
          userId: profileId,
        },
      });

      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(error.response?.data);
      } else if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, [profileId]);

  return (
    <div id="main">
      {loading ? (
        <LoadingContainer />
      ) : (
        <div id="profile">
          <header>
            <img src={profile?.profile_picture_url} alt="" />
            <div>
              <div>{profile?.username}</div>
              <p>{profile?.email}</p>
            </div>
          </header>
          <main>
            <div>
              <div>Followers</div>
              <p>{profile?.followers}</p>
            </div>
            <div>
              <div>Karma</div>
              <p>{(profile?.likes ?? 0) - (profile?.dislikes ?? 0)}</p>
            </div>
          </main>
          <footer>
            <Button type="button" id="follow" className="padding">
              Follow
            </Button>
          </footer>
        </div>
      )}
    </div>
  );
};
