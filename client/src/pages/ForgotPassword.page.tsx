import { Navigation } from "../components/Navigation.component";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Input } from "../components/Input.component";
import { Button } from "../components/Button.component";
import { LoadingSpinner } from "../components/Loading.component";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import * as yup from "yup";
import {
  ForgotPasswordFormTypes,
  ResetPasswordFormTypes,
} from "../../types/pages/Page.types";
import { forgotPassword, resetPassword } from "../features/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { CgClose } from "react-icons/cg";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email().required(),
});

export const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormTypes>({
    mode: "onChange",
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormTypes) => {
    await dispatch(forgotPassword(data));
  };

  return (
    <form id="auth" method="POST" onSubmit={handleSubmit(onSubmit)}>
      <Navigation link="/login" type="button">
        <CgClose />
      </Navigation>
      <h1>Forgot Password</h1>
      <main>
        <Input
          id="email"
          type="text"
          title="Email"
          register={register("email", { required: true })}
          placeholder="Email"
        >
          {errors.email && <div className="error">{errors.email.message}</div>}
        </Input>
      </main>
      <Button id="login" type="submit" className="primary">
        {status === "loading" ? (
          <LoadingSpinner isPrimary />
        ) : (
          <div>Send token</div>
        )}
      </Button>
      <footer>
        <p>Remember your password?</p>
        <Navigation link="/login" type="link">
          Login
        </Navigation>
      </footer>
    </form>
  );
};

const resetPasswordSchema = yup.object().shape({
  email: yup.string().email().required(),
  newPassword: yup.string().required(),
  newConfirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
    .required(),
  token: yup.string().required(),
});

export const ResetPassword = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);
  const [showPasswords, setShowPasswords] = useState<{
    newPassword: boolean;
    newConfirmPassword: boolean;
  }>({
    newPassword: false,
    newConfirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormTypes>({
    mode: "onChange",
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormTypes) => {
    try {
      await dispatch(resetPassword(data));
      navigation("/login");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const showPassword = (passwordType: keyof typeof showPasswords) => {
    setShowPasswords((prevValue) => ({
      ...prevValue,
      [passwordType]: !prevValue[passwordType],
    }));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");

    setValue("token", token ?? "");
    setValue("email", email ?? "");
  }, [location.search]);

  return (
    <form id="auth" method="POST" onSubmit={handleSubmit(onSubmit)}>
      <Navigation link="/login" type="button">
        <CgClose />
      </Navigation>
      <h1>Reset password</h1>
      <main>
        <Input
          id="email"
          type="text"
          title="Email"
          register={register("email", { required: true })}
          placeholder="Email"
        >
          {errors.email && <div className="error">{errors.email.message}</div>}
        </Input>
        <Input
          id="token"
          type="text"
          title="Token"
          register={register("token", { required: true })}
          placeholder="Token"
        >
          {errors.token && <div className="error">{errors.token.message}</div>}
        </Input>
        <Input
          id="newPassword"
          type={showPasswords.newPassword ? "text" : "password"}
          title="New password"
          register={register("newPassword", { required: true })}
          placeholder="New password"
        >
          <Button
            id="showPassword"
            type="button"
            onClick={() => showPassword("newPassword")}
          >
            {showPasswords.newPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </Button>
          {errors.newPassword && (
            <div className="error">{errors.newPassword.message}</div>
          )}
        </Input>
        <Input
          id="confirmNewPassword"
          type={showPasswords.newConfirmPassword ? "text" : "password"}
          title="Confirm new password"
          register={register("newConfirmPassword", { required: true })}
          placeholder="Confirm new password"
        >
          <Button
            id="showNewConfirmPassword"
            type="button"
            onClick={() => showPassword("newConfirmPassword")}
          >
            {showPasswords.newConfirmPassword ? (
              <IoEyeOffOutline />
            ) : (
              <IoEyeOutline />
            )}
          </Button>
          {errors.newConfirmPassword && (
            <div className="error">{errors.newConfirmPassword.message}</div>
          )}
        </Input>
      </main>
      <Button id="login" type="submit" className="primary">
        {status === "loading" ? (
          <LoadingSpinner isPrimary />
        ) : (
          <div>Confirm</div>
        )}
      </Button>
      <footer>
        <p>Don`t need to reset password?</p>
        <Navigation link="/login" type="link">
          Login
        </Navigation>
      </footer>
    </form>
  );
};
