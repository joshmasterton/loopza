import { Button } from "../components/Button.component";
import { Input } from "../components/Input.component";
import { IoEye } from "react-icons/io5";
import { useForm } from "react-hook-form";
import {
  SignupFormTypes,
  AuthPageTypes,
  LoginFormTypes,
} from "../../types/pages/Page.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Navigation } from "../components/Navigation.component";
import { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import loopza from "../assets/loopza.png";
import * as yup from "yup";
import { login, signup } from "../services/auth.service";

const LoginForm = () => {
  const loginSchema = yup.object().shape({
    username: yup.string().required("Username required"),
    password: yup.string().required("Password required"),
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
    await login(data);
  };

  return (
    <form method="POST" onSubmit={handleSubmit(onSubmit)}>
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
          type="password"
          title="Password"
          register={register("password", { required: true })}
          placeholder="Password"
        >
          <Button id="showPassword" type="button">
            <IoEye />
          </Button>
          {errors.password && (
            <div className="error">{errors.password.message}</div>
          )}
        </Input>
      </main>
      <Button id="auth" type="submit">
        Login
      </Button>
      <footer>
        <p>Don`t have an account?</p>
        <Navigation link="/signup">Signup</Navigation>
      </footer>
    </form>
  );
};

const SignupForm = () => {
  const profilePictureLabelRef = useRef<HTMLInputElement>(null);
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
      .required("Password is required"),
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

    await signup(formData);
  };

  useEffect(() => {
    if (profilePicture?.[0] && profilePicture?.[0].type.includes("image")) {
      setImagePreview(URL.createObjectURL(profilePicture[0]));
    }
  }, [profilePicture]);

  return (
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
      <h1>Signup</h1>
      <main>
        <Input
          id="profilePicture"
          type="file"
          title=""
          className="file"
          register={register("profilePicture", { required: true })}
          placeholder="Profile Picture"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Profile picture" />
          ) : (
            <FaUser />
          )}
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
          type="password"
          title="Password"
          register={register("password", { required: true })}
          placeholder="Password"
        >
          <Button id="showPassword" type="button">
            <IoEye />
          </Button>
          {errors.password && (
            <div className="error">{errors.password.message}</div>
          )}
        </Input>
        <Input
          id="confirmPassword"
          type="password"
          title="Confirm Password"
          register={register("confirmPassword", { required: true })}
          placeholder="Confirm Password"
        >
          <Button id="showConfirmPassword" type="button">
            <IoEye />
          </Button>
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword.message}</div>
          )}
        </Input>
      </main>
      <Button id="auth" type="submit">
        Signup
      </Button>
      <footer>
        <p>Already have an account?</p>
        <Navigation link="/">Login</Navigation>
      </footer>
    </form>
  );
};

export const Auth = ({ isLogin }: AuthPageTypes) => {
  return (
    <>
      <img src={loopza} alt="logo" />
      {isLogin ? <LoginForm /> : <SignupForm />}
    </>
  );
};
