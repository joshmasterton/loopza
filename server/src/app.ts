import { loginRouter } from "./routes/auth/login.route";
import { signupRouter } from "./routes/auth/signup.route";
import { initializeDatabase, TableConfig } from "./config/database.config";
import { userRouter } from "./routes/auth/user.route";
import { fileURLToPath } from "url";
import { logoutRoute } from "./routes/auth/logout.route";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import path from "path";
import { rateLimit } from "express-rate-limit";
import { newPostCommentRouter } from "./routes/postComment/newPostComment.route";
import { getPostCommentRouter } from "./routes/postComment/getPostComment.route";
import { getPostsCommentsRouter } from "./routes/postComment/getPostsComments.route";
import { likeDislikePostCommentRouter } from "./routes/postComment/likeDislikePostComment.routes";
import { getUserRouter } from "./routes/user/getUser.route";
import { followUserRoute } from "./routes/user/followUser.route";
import { getUsersRouter } from "./routes/user/getUsers.route";
import { deleteFollowRoute } from "./routes/user/deleteFollow.route";
import {
  scheduleRandomBotComment,
  scheduleRandomBotLikeDislike,
  scheduleRandomBotPost,
} from "./config/cron.config";
import { forgotPasswordRouter } from "./routes/auth/forgotPassword.route";
import { resetPasswordRouter } from "./routes/auth/resetPassword.route";
import { weatherRoute } from "./routes/utilities/weather.route";
import { updateProfileRoute } from "./routes/auth/updateProfile.route";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(
    __dirname,
    "..",
    "..",
    `${process.env.NODE_ENV === "development" ? ".env.dev" : ".env.test"}`
  ),
});

export const app = express();
export const tableConfig = new TableConfig();

const { CLIENT_URL } = process.env;

app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookie());

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.get("/", (_req, res) => res.json({ message: "Welcome to loopza" }));

app.use("/auth", loginRouter);
app.use("/auth", signupRouter);
app.use("/auth", userRouter);
app.use("/auth", logoutRoute);
app.use("/auth", forgotPasswordRouter);
app.use("/auth", resetPasswordRouter);
app.use("/auth", updateProfileRoute);

app.use("/postComment", newPostCommentRouter);
app.use("/postComment", getPostCommentRouter);
app.use("/postComment", getPostsCommentsRouter);
app.use("/postComment", likeDislikePostCommentRouter);

app.use("/user", getUserRouter);
app.use("/user", getUsersRouter);
app.use("/user", followUserRoute);
app.use("/user", deleteFollowRoute);

app.use("/weather", weatherRoute);

const startServer = async () => {
  try {
    await initializeDatabase();
    scheduleRandomBotPost();
    scheduleRandomBotComment();
    scheduleRandomBotLikeDislike();
    app.listen(80, () => {
      console.log("Listening to server on port 80");
    });
  } catch (error) {
    const retryInterval = 5000;
    if (error instanceof Error) {
      console.log(
        `Error starting database: ${
          error.message
        }. Will retry connection to server in ${retryInterval / 1000}s...`
      );
    }

    setTimeout(startServer, retryInterval);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}
