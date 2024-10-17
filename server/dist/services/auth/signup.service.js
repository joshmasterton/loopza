import { User } from "../../models/auth/user.model.js";
import { generateToken } from "../../utilities/token.utilities.js";
export const signupUser = async (username, email, password, file) => {
    try {
        const newUser = new User(username, email, password, file);
        await newUser.signup();
        const userId = await newUser.getUserId("username_lower_case", username.toLowerCase());
        if (!userId) {
            throw new Error("Unable to retrieve user");
        }
        const refreshToken = generateToken(userId, "refresh");
        const accessToken = generateToken(userId, "access");
        await newUser.updateRefreshToken(refreshToken, userId);
        return { accessToken, refreshToken };
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
    }
};
