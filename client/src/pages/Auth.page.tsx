import { Button } from "../components/Button.component";
import { Input } from "../components/Input.component";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import {
  SignupFormTypes,
  AuthPageTypes,
  LoginFormTypes,
} from "../../types/pages/Page.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Navigation } from "../components/Navigation.component";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser } from "../features/authSlice";
import { AppDispatch, RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { CgClose } from "react-icons/cg";
import { LoadingSpinner } from "../components/Loading.component";
import { TiUserOutline } from "react-icons/ti";
import logo from "../assets/loopza.png";
import logo_dark from "../assets/loopza_dark.png";
import * as yup from "yup";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);
  const { currentTheme } = useSelector((state: RootState) => state.theme);

  const loginSchema = yup.object().shape({
    username: yup
      .string()
      .min(6, "Username must be at least 6 characters")
      .required("Username required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormTypes>({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormTypes) => {
    await dispatch(loginUser(data));
  };

  return (
    <form id="auth" method="POST" onSubmit={handleSubmit(onSubmit)}>
      <img src={currentTheme === "dark" ? logo_dark : logo} alt="logo" />
      <Navigation link="/" type="button">
        <CgClose />
      </Navigation>
      <h1>Login</h1>
      <main>
        <Input
          id="username"
          type="text"
          title="Username"
          register={register("username", { required: true })}
          placeholder="Username"
        >
          {errors.username && (
            <div className="error">{errors.username.message}</div>
          )}
        </Input>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          title="Password"
          register={register("password", { required: true })}
          placeholder="Password"
        >
          <Button
            id="showPassword"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </Button>
          {errors.password && (
            <div className="error">{errors.password.message}</div>
          )}
        </Input>
        <Navigation link="/forgotPassword" type="link">
          Forget password?
        </Navigation>
      </main>
      <Button id="login" type="submit" className="primary">
        {status === "loading" ? <LoadingSpinner isPrimary /> : <div>Login</div>}
      </Button>
      <footer>
        <p>Don`t have an account?</p>
        <Navigation link="/signup" type="link">
          Signup
        </Navigation>
      </footer>
    </form>
  );
};

const SignupForm = () => {
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
  const { currentTheme } = useSelector((state: RootState) => state.theme);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );

  const signupSchema = yup.object().shape({
    username: yup
      .string()
      .min(6, "Username must be at least 6 characters")
      .required("Username is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    profilePicture: yup
      .mixed<FileList>()
      .test("file", "Profile picture required", (file) => {
        if (file && file?.length > 0) return true;
        return false;
      })
      .test("validFileType", "Profile picture must be an image", (file) => {
        if (file && file?.length > 0 && file[0].type.includes("image"))
          return true;
        return false;
      })
      .test("maximumFileSize", "Profile picture is too large", (file) => {
        if (file && file?.length > 0 && file[0].size < 2000000) return true;
        return false;
      })
      .required(),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm password is required"),
  });

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<SignupFormTypes>({
    mode: "onChange",
    resolver: yupResolver(signupSchema),
  });

  const profilePicture = watch("profilePicture");

  const onSubmit = async (data: SignupFormTypes) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("profilePicture", data.profilePicture[0]);

    await dispatch(signupUser(formData));
  };

  const showPassword = (passwordType: keyof typeof showPasswords) => {
    setShowPasswords((prevValue) => ({
      ...prevValue,
      [passwordType]: !prevValue[passwordType],
    }));
  };

  useEffect(() => {
    if (profilePicture?.[0] && profilePicture?.[0].type.includes("image")) {
      setImagePreview(URL.createObjectURL(profilePicture[0]));
    } else {
      setImagePreview(undefined);
    }
  }, [profilePicture]);

  return (
    <form
      id="auth"
      method="POST"
      onSubmit={handleSubmit(onSubmit, (errors) => {
        if (errors.profilePicture) {
          profilePictureLabelRef.current?.focus();
        } else {
          setFocus("username");
        }
      })}
    >
      <img src={currentTheme === "dark" ? logo : logo_dark} alt="logo" />
      <Navigation link="/" type="button">
        <CgClose />
      </Navigation>
      <h1>Signup</h1>
      <main>
        <Input
          id="profilePicture"
          type="file"
          title="Profile picture"
          className="file"
          register={register("profilePicture", { required: true })}
          placeholder="Profile picture"
        >
          {imagePreview ? <img src={imagePreview} alt="" /> : <TiUserOutline />}
          {errors.profilePicture && (
            <div className="error">{errors.profilePicture.message}</div>
          )}
        </Input>
        <Input
          id="username"
          type="text"
          title="Username"
          register={register("username", { required: true })}
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
          register={register("email", { required: true })}
          placeholder="Email"
        >
          {errors.email && <div className="error">{errors.email.message}</div>}
        </Input>
        <Input
          id="password"
          type={showPasswords.password ? "text" : "password"}
          title="Password"
          register={register("password", { required: true })}
          placeholder="Password"
        >
          <Button
            id="showPassword"
            type="button"
            onClick={() => showPassword("password")}
          >
            {showPasswords.password ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </Button>
          {errors.password && (
            <div className="error">{errors.password.message}</div>
          )}
        </Input>
        <Input
          id="confirmPassword"
          type={showPasswords.confirmPassword ? "text" : "password"}
          title="Confirm password"
          register={register("confirmPassword", { required: true })}
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
            <div className="error">{errors.confirmPassword.message}</div>
          )}
        </Input>
      </main>
      <Button id="signup" type="submit" className="primary">
        {status === "loading" ? (
          <LoadingSpinner isPrimary />
        ) : (
          <div>Signup</div>
        )}
      </Button>
      <footer>
        <p>Already have an account?</p>
        <Navigation link="/login" type="link">
          Login
        </Navigation>
      </footer>
    </form>
  );
};

export const Auth = ({ isLogin }: AuthPageTypes) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return <>{isLogin ? <LoginForm /> : <SignupForm />}</>;
};
