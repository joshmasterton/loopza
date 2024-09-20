export type AuthPageTypes = {
  isLogin?: boolean;
};

export type SignupFormTypes = {
  username: string;
  email: string;
  profilePicture: FileList;
  password: string;
  confirmPassword: string;
};

export type LoginFormTypes = {
  username: string;
  password: string;
};
