import jwt from "jsonwebtoken";
const { JWT_SECRET_ACCESS_KEY, JWT_SECRET_REFRESH_KEY } = process.env;
export const generateToken = (userId, type) => {
    if (!JWT_SECRET_ACCESS_KEY || !JWT_SECRET_REFRESH_KEY) {
        throw new Error("No jwt keys found");
    }
    if (type === "refresh") {
        return jwt.sign({ id: userId }, JWT_SECRET_REFRESH_KEY, {
            expiresIn: "7d",
        });
    }
    return jwt.sign({ id: userId }, JWT_SECRET_ACCESS_KEY, { expiresIn: "15m" });
};
export const verifyToken = (token, type) => {
    try {
        if (!JWT_SECRET_ACCESS_KEY || !JWT_SECRET_REFRESH_KEY) {
            throw new Error("No jwt keys found");
        }
        return jwt.verify(token, type === "access" ? JWT_SECRET_ACCESS_KEY : JWT_SECRET_REFRESH_KEY);
    }
    catch {
        throw new Error("Token is invalid or expired");
    }
};
