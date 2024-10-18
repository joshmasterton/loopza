import { User } from "../models/auth/user.model.js";
import { generateToken } from "../utilities/token.utilities.js";
import jwt from "jsonwebtoken";
const { JWT_SECRET_ACCESS_KEY, JWT_SECRET_REFRESH_KEY } = process.env;
export const authenticateToken = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    try {
        if (!accessToken || !refreshToken) {
            throw new Error("No tokens present");
        }
        if (!JWT_SECRET_ACCESS_KEY || !JWT_SECRET_REFRESH_KEY) {
            throw new Error("No jwt keys found");
        }
        const decoded = jwt.verify(accessToken, JWT_SECRET_ACCESS_KEY);
        const user = new User();
        const serializedUser = await user.getUser("id", decoded.id);
        if (!serializedUser) {
            throw new Error("Error finding user");
        }
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            domain: process.env.NODE_ENV === "production" ? ".zonomaly.com" : "",
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            domain: process.env.NODE_ENV === "production" ? ".zonomaly.com" : "",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        req.user = serializedUser;
        next();
    }
    catch {
        try {
            if (!refreshToken) {
                return res
                    .status(401)
                    .json({ error: "No token present, authorization denied" });
            }
            if (!JWT_SECRET_ACCESS_KEY || !JWT_SECRET_REFRESH_KEY) {
                throw new Error("No jwt keys found");
            }
            const user = new User("", "", "");
            const serializedUser = await user.getUser("refresh_token", refreshToken);
            if (!serializedUser) {
                return res.status(403).json({ error: "Invalid refresh token" });
            }
            const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESH_KEY);
            if (decoded.id !== serializedUser.id) {
                throw new Error("Token error");
            }
            const newAccessToken = generateToken(serializedUser?.id, "access");
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                domain: process.env.NODE_ENV === "production" ? ".zonomaly.com" : "",
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                domain: process.env.NODE_ENV === "production" ? ".zonomaly.com" : "",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            req.user = serializedUser;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ error: error.message });
            }
            return res.status(401).json({ error: "Authorization denied" });
        }
    }
};
