import { Button } from "../components/Button.component";
import { Input } from "../components/Input.component";
import { Form, Link } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { AuthPageTypes } from "../../types/pages/Page.types";
import loopza from "../assets/loopza.png";

export const Auth = ({ isLogin }: AuthPageTypes) => {
  return (
    <>
      <img src={loopza} alt="logo" />
      <Form method="POST">
        <h1>{isLogin ? "Login" : "Signup"}</h1>
        <main>
          <Input
            id="username"
            type="text"
            title="Username"
            placeholder="Username"
          />
          <Input
            id="password"
            type="password"
            title="Password"
            placeholder="Password"
          >
            <Button id="" type="button">
              <IoEye />
            </Button>
          </Input>
        </main>
        <Button id="auth" type="submit">
          Login
        </Button>
        {isLogin ? (
          <footer>
            <p>Don`t have an account?</p>
            <Link to="/">Signup</Link>
          </footer>
        ) : (
          <footer>
            <p>Already have an account?</p>
            <Link to="/">Login</Link>
          </footer>
        )}
      </Form>
    </>
  );
};
