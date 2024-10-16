import { signupUser } from "../../services/auth/signup.service";
import validator from "validator";
import * as yup from "yup";
const signupSchema = yup.object().shape({
    username: yup
        .string()
        .min(6, "Username must be at least 6 characters")
        .required(),
    email: yup.string().email("Must be a valid email type").required(),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), undefined], "Passwords must match")
        .required(),
});
export const signup = async (req, res) => {
    try {
        const validatedData = await signupSchema.validate(req.body);
        const file = req.file;
        const serializedUsername = validator.escape(validatedData.username);
        const serializedEmail = validator.escape(validatedData.email);
        if (!file) {
            throw new Error("No profile picture found");
        }
        const tokens = await signupUser(serializedUsername, serializedEmail, validatedData.password, file);
        return res
            .cookie("accessToken", tokens?.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        })
            .cookie("refreshToken", tokens?.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
            .json({ message: "Signup successful" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({ error: "signup error has occured" });
    }
};
