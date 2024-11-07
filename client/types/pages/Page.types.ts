export type AuthPageTypes = {
  isLogin?: boolean;
};

export type PostFormTypes = {
  post: string;
  postPicture?: FileList;
};

export type SignupFormTypes = {
  username: string;
  email: string;
  profilePicture: FileList;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordFormTypes = {
  email: string;
  newPassword: string;
  newConfirmPassword: string;
  token: string;
};

export type ForgotPasswordFormTypes = {
  email: string;
};

export type LoginFormTypes = {
  email: string;
  password: string;
};
