import { User } from "../../models/auth/user.model";
import { generateToken } from "../../utilities/token.utilities";

export const loginUser = async (email: string, password: string) => {
  try {
    const user = new User(undefined, email, password);
    await user.login();

    const userId = await user.getUserId("email", email);

    if (!userId) {
      throw new Error("User login failed");
    }

    const refreshToken = generateToken(userId, "refresh");
    const accessToken = generateToken(userId, "access");

    await user.updateRefreshToken(refreshToken, userId);

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
