import { User } from "../../models/auth/user.model";
import { generateToken } from "../../utilities/token.utilities";

export const signupUser = async (
  username: string,
  email: string,
  password: string,
  profilePictureURL: string
) => {
  try {
    const newUser = new User(username, email, password, profilePictureURL);
    await newUser.signup();

    const userId = await newUser.getUserId(
      "username_lower_case",
      username.toLowerCase()
    );

    if (!userId) {
      throw new Error("Unable to retrieve user");
    }

    const refreshToken = generateToken(userId, "refresh");
    const accessToken = generateToken(userId, "access");

    await newUser.updateRefreshToken(refreshToken, userId);

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
