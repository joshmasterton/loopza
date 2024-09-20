import express from "express";
import cors from "cors";
import { login } from "./routes/auth/login.route";
import { signup } from "./routes/auth/signup.route";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({ origin: "http://localhost:9000" }));

app.use("/login", login);
app.use("/signup", signup);

app.listen(80, () => {
  console.log("Listening to server on port 80");
});
