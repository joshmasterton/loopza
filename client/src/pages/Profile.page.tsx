import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { UserTypes } from "../../types/features/features.types";
import { API_URL } from "../utilities/request.utilities";
import { useLocation } from "react-router-dom";
import { LoadingContainer } from "../components/Loading.component";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "../components/User.component";

export const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
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
          requesterId: user?.id,
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
    setProfile(undefined);
    getProfile();
  }, [profileId]);

  return (
    <div id="main">
      {loading ? (
        <LoadingContainer />
      ) : (
        profile && <User profile={profile} type="page" />
      )}
    </div>
  );
};
