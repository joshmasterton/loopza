import { Navigation } from "./Navigation.component";
import { UserTypes } from "../../types/features/features.types";
import { Button } from "./Button.component";
import axios, { AxiosError } from "axios";
import { API_URL } from "../utilities/request.utilities";
import { withUserCheck } from "../utilities/Protected.utilities";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect, useRef, useState } from "react";
import { LoadingContainer, LoadingSpinner } from "./Loading.component";
import { TiGroupOutline, TiUserOutline } from "react-icons/ti";
import { MdOutlineCreate, MdOutlineLocalPostOffice } from "react-icons/md";
import {
  IoChatbubbleOutline,
  IoEyeOffOutline,
  IoEyeOutline,
} from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { UpdateProfileFormTypes } from "../../types/pages/Page.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "./Input.component";
import { CgClose } from "react-icons/cg";
import { updateProfile } from "../features/authSlice";

export const User = ({
  profile,
  type,
  isSide = false,
}: {
  profile: UserTypes;
  type: "component" | "page";
  isSide?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentUser, setCurrentUser] = useState(profile);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(false);

  const getUser = async () => {
    try {
      setLoadingCurrentUser(false);
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
    } finally {
      setLoadingCurrentUser(false);
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
      <div className={`user ${isSide ? "sideComp" : ""}`}>
        <Navigation link={`/profile/${currentUser?.id}`} type="button" />
        <header>
          <div>
            <div className={`${currentUser.is_online ? "online" : "offline"}`}>
              <div />
            </div>
            <img src={currentUser?.profile_picture_url} alt="" />
          </div>
          <div>
            <div>{currentUser?.username}</div>
            <p>{currentUser?.email}</p>
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
    const [isUpdate, setIsUpdate] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const profilePictureLabelRef = useRef<HTMLInputElement>(null);
    const [showPasswords, setShowPasswords] = useState<{
      password: boolean;
      confirmPassword: boolean;
    }>({
      password: false,
      confirmPassword: false,
    });
    const { status } = useSelector((state: RootState) => state.auth);
    const [imagePreview, setImagePreview] = useState<string | undefined>(
      undefined
    );

    const updateProfileSchema = yup.object().shape({
      username: yup
        .string()
        .test(
          "is-empty-or-min",
          "Username must be at least 6 characters",
          (value) => !value || value.length >= 6
        )
        .optional(),
      email: yup.string().email("Invalid email format").optional(),
      profilePicture: yup
        .mixed<FileList>()
        .test("validFileType", "Profile picture must be an image", (file) => {
          if (!file || file.length === 0) return true;
          return file[0].type.includes("image");
        })
        .test("maximumFileSize", "Profile picture is too large", (file) => {
          if (!file || file.length === 0) return true;
          return file[0].size < 10000000;
        }),
      password: yup
        .string()
        .test(
          "is-empty-or-min",
          "Password must be at least 6 characters",
          (value) => !value || value.length >= 6
        )
        .optional(),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), undefined], "Passwords must match"),
    });

    const {
      register,
      handleSubmit,
      watch,
      setFocus,
      reset,
      formState: { errors },
    } = useForm<UpdateProfileFormTypes>({
      mode: "onChange",
      resolver: yupResolver(updateProfileSchema),
    });

    const profilePicture = watch("profilePicture");

    const showPassword = (passwordType: keyof typeof showPasswords) => {
      setShowPasswords((prevValue) => ({
        ...prevValue,
        [passwordType]: !prevValue[passwordType],
      }));
    };

    const onSubmit = async (data: UpdateProfileFormTypes) => {
      const formData = new FormData();
      if (data.username) {
        formData.append("username", data.username);
      }
      if (data.email) {
        formData.append("email", data.email);
      }
      if (data.password) {
        formData.append("newPassword", data.password);
      }

      if (data.confirmPassword) {
        formData.append("confirmNewPassword", data.confirmPassword);
      }

      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture[0]);
      }

      await dispatch(updateProfile(formData));
      await getUser();
      reset();
    };

    useEffect(() => {
      if (profilePicture?.[0] && profilePicture?.[0].type.includes("image")) {
        setImagePreview(URL.createObjectURL(profilePicture[0]));
      } else {
        setImagePreview(undefined);
      }
    }, [profilePicture]);

    return (
      <div id="profile">
        {loadingCurrentUser ? (
          <LoadingContainer />
        ) : (
          <>
            <header>
              <>
                <img src={currentUser?.profile_picture_url} alt="" />
                <img src={currentUser?.profile_picture_url} alt="" />
              </>
              <div>
                <div>{currentUser?.username}</div>
                <p>{currentUser?.email}</p>
              </div>
            </header>
            {user?.id === currentUser.id && (
              <Button
                id="edit"
                type="button"
                className="outline"
                onClick={() => {
                  setIsUpdate(!isUpdate);
                  reset();
                }}
              >
                {isUpdate ? <CgClose /> : <MdOutlineCreate />}
              </Button>
            )}
            {isUpdate && (
              <form
                method="POST"
                onSubmit={handleSubmit(onSubmit, (errors) => {
                  if (errors.profilePicture) {
                    profilePictureLabelRef.current?.focus();
                  } else {
                    setFocus("username");
                  }
                })}
              >
                <main>
                  <Input
                    id="profilePicture"
                    type="file"
                    title="Profile picture"
                    className="file"
                    register={register("profilePicture")}
                    placeholder="Profile picture"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="" />
                    ) : (
                      <TiUserOutline />
                    )}
                    {errors.profilePicture && (
                      <div className="error">
                        {errors.profilePicture.message}
                      </div>
                    )}
                  </Input>
                  <Input
                    id="username"
                    type="text"
                    title="Username"
                    register={register("username")}
                    placeholder="Username"
                  >
                    {errors.username && (
                      <div className="error">{errors.username.message}</div>
                    )}
                  </Input>
                  <Input
                    id="email"
                    type="email"
                    title="Email"
                    register={register("email")}
                    placeholder="Email"
                  >
                    {errors.email && (
                      <div className="error">{errors.email.message}</div>
                    )}
                  </Input>
                  <Input
                    id="password"
                    type={showPasswords.password ? "text" : "password"}
                    title="Password"
                    register={register("password")}
                    placeholder="Password"
                  >
                    <Button
                      id="showPassword"
                      type="button"
                      onClick={() => showPassword("password")}
                    >
                      {showPasswords.password ? (
                        <IoEyeOffOutline />
                      ) : (
                        <IoEyeOutline />
                      )}
                    </Button>
                    {errors.password && (
                      <div className="error">{errors.password.message}</div>
                    )}
                  </Input>
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    title="Confirm password"
                    register={register("confirmPassword")}
                    placeholder="Confirm password"
                  >
                    <Button
                      id="showConfirmPassword"
                      type="button"
                      onClick={() => showPassword("confirmPassword")}
                    >
                      {showPasswords.confirmPassword ? (
                        <IoEyeOffOutline />
                      ) : (
                        <IoEyeOutline />
                      )}
                    </Button>
                    {errors.confirmPassword && (
                      <div className="error">
                        {errors.confirmPassword.message}
                      </div>
                    )}
                  </Input>
                </main>
                <Button id="update" type="submit" className="primary">
                  {status === "loading" ? (
                    <LoadingSpinner isPrimary />
                  ) : (
                    <div>Update</div>
                  )}
                </Button>
              </form>
            )}
            <main>
              <div>
                <TiGroupOutline />
                <div>Followers</div>
                <p>{currentUser?.followers}</p>
              </div>
              <div>
                <MdOutlineLocalPostOffice />
                <div>Posts</div>
                <p>{currentUser?.posts}</p>
              </div>
              <div>
                <IoChatbubbleOutline />
                <div>Comments</div>
                <p>{currentUser?.comments}</p>
              </div>
              <div>
                <FaRegStar />
                <div>Karma</div>
                <p>
                  {(currentUser?.likes ?? 0) - (currentUser?.dislikes ?? 0)}
                </p>
              </div>
            </main>
            {user?.id !== profile.id && (
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
            )}
          </>
        )}
      </div>
    );
  }
};
