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
export const tableConfig = new TableConfig("users");

const { CLIENT_URL } = process.env;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookie());

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(helmet());

app.get("/", (_req, res) => res.json({ message: "Welcome to loopza" }));

app.use("/auth", loginRouter);
app.use("/auth", signupRouter);
app.use("/auth", userRouter);
app.use("/auth", logoutRoute);

const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== "test") {
      await initializeDatabase();
      app.listen(80, () => {
        console.log("Listening to server on port 80");
      });
    }
  } catch (error) {
    const retryInterval = 5000;
    if (error instanceof Error) {
      console.log(
        `Error starting database: ${
          error.message
        }. Will retry connection to server in ${retryInterval / 1000}s`
      );
    }

    setTimeout(startServer, retryInterval);
  }
};

startServer();
