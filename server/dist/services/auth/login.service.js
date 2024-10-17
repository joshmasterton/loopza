import { User } from "../../models/auth/user.model.js";
import { generateToken } from "../../utilities/token.utilities.js";
export const loginUser = async (username, password) => {
    try {
        const user = new User(username, "", password);
        await user.login();
        const userId = await user.getUserId("username_lower_case", username.toLowerCase());
        if (!userId) {
            throw new Error("User login failed");
        }
        const refreshToken = generateToken(userId, "refresh");
        const accessToken = generateToken(userId, "access");
        await user.updateRefreshToken(refreshToken, userId);
        return { accessToken, refreshToken };
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
    }
};
