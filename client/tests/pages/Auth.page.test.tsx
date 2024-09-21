import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { describe, expect, test, vitest } from "vitest";
import { memoryRouter } from "../utilities/router";
import { login, signup } from "../../src/services/auth.service";
import userEvent from "@testing-library/user-event";

vitest.mock("../../src/services/auth.service");

describe("Auth page", () => {
  test("Should render correct auth page", () => {
    const loginPage = render(<RouterProvider router={memoryRouter("/")} />);
    const signupPage = render(
      <RouterProvider router={memoryRouter("/signup")} />
    );

    expect(
      loginPage.queryByRole("heading", { name: "Login" })
    ).toBeInTheDocument();
    expect(
      signupPage.queryByRole("heading", { name: "Signup" })
    ).toBeInTheDocument();
  });

  test("Should return errors on invalid login form submission", async () => {
    render(<RouterProvider router={memoryRouter("/")} />);

    const loginButton = screen.getByRole("button", { name: "Login" });
    await userEvent.click(loginButton);

    expect(screen.queryByText("Username required")).toBeInTheDocument();
    expect(screen.queryByText("Password required")).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  test("Should return errors on invalid signup form submission", async () => {
    render(<RouterProvider router={memoryRouter("/signup")} />);

    const usernameInput = screen.getByLabelText("Username");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");

    await userEvent.type(usernameInput, "testUser");
    await userEvent.type(emailInput, "Email@email.com");
    await userEvent.type(passwordInput, "Password");
    await userEvent.type(confirmPasswordInput, "Password");

    const signupButton = screen.getByRole("button", { name: "Signup" });
    await userEvent.click(signupButton);

    expect(screen.queryByText("Profile picture required"));
    expect(signup).not.toHaveBeenCalled();
  });

  test("Should return successful login form submission", async () => {
    render(<RouterProvider router={memoryRouter("/")} />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    await userEvent.type(usernameInput, "testUser");
    await userEvent.type(passwordInput, "Password");

    const loginButton = screen.getByRole("button", { name: "Login" });
    await userEvent.click(loginButton);

    expect(login).toHaveBeenCalledWith({
      username: "testUser",
      password: "Password",
    });
  });

  test("Should return successful signup form submission", async () => {
    globalThis.URL.createObjectURL = vitest.fn();

    render(<RouterProvider router={memoryRouter("/signup")} />);

    const profilePictureInput = screen.getByLabelText("Profile picture");
    const usernameInput = screen.getByLabelText("Username");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");

    await userEvent.upload(
      profilePictureInput,
      new File([new Blob([""])], "image.png", { type: "image/png" })
    );
    await userEvent.type(usernameInput, "testUser");
    await userEvent.type(emailInput, "Email@email.com");
    await userEvent.type(passwordInput, "Password");
    await userEvent.type(confirmPasswordInput, "Password");

    const signupButton = screen.getByRole("button", { name: "Signup" });
    await userEvent.click(signupButton);

    expect(signup).toHaveBeenCalledWith(expect.any(FormData));
  });
});
