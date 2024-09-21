import { login } from "./routes/auth/login.route";
import { signup } from "./routes/auth/signup.route";
import { runMigrations } from "./database/migrations.database";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    __dirname,
    "..",
    "..",
    `${process.env.NODE_ENV === "development" ? ".env.dev" : ".env.test"}`
  ),
});

export const app = express();

const { CLIENT_URL } = process.env;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({ origin: CLIENT_URL }));
app.use(helmet());

app.get("/", (_req, res) => res.json({ message: "Welcome to loopza" }));

app.use("/login", login);
app.use("/signup", signup);

const startServer = async () => {
  if (process.env.NODE_ENV !== "test") {
    await runMigrations();
    app.listen(80, () => {
      console.log("Listening to server on port 80");
    });
  }
};

startServer();
