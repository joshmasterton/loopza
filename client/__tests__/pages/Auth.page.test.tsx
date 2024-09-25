import { render, screen } from "@testing-library/react";
import { describe, expect, Mock, test, vitest } from "vitest";
import { act } from "react";
import { Test } from "../utilities/Test.utilities";
import userEvent from "@testing-library/user-event";
import axios from "axios";

vitest.mock("axios");

describe("Auth page", () => {
  test("Should render correct auth page", async () => {
    (axios.get as Mock).mockResolvedValueOnce({ data: { user: null } });

    await act(async () => {
      render(<Test />);
    });

    const signupNavigate = screen.getByText("Signup");

    expect(
      screen.queryByRole("heading", { name: "Login" })
    ).toBeInTheDocument();

    await userEvent.click(signupNavigate);

    expect(
      screen.queryByRole("heading", { name: "Signup" })
    ).toBeInTheDocument();

    const loginNavigate = screen.getByText("Login");
    await userEvent.click(loginNavigate);
  });

  test("Should return errors on invalid login form submission", async () => {
    (axios.get as Mock).mockResolvedValueOnce({ data: { user: null } });

    await act(async () => {
      render(<Test />);
    });

    const loginButton = screen.getByRole("button", { name: "Login" });
    await userEvent.click(loginButton);

    expect(screen.queryByText("Username required")).toBeInTheDocument();
    expect(screen.queryByText("Password required")).toBeInTheDocument();
  });

  test("Should return errors on invalid signup form submission", async () => {
    (axios.get as Mock).mockResolvedValueOnce({ data: { user: null } });

    await act(async () => {
      render(<Test />);
    });

    const signupNavigate = screen.getByText("Signup");
    await userEvent.click(signupNavigate);

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
  });

  test("Should return successful login form submission", async () => {
    (axios.get as Mock).mockResolvedValueOnce({ data: { user: null } });
    (axios.get as Mock).mockResolvedValueOnce({ data: { user: null } });

    await act(async () => {
      render(<Test />);
    });

    const loginNavigate = screen.getByText("Login");
    await userEvent.click(loginNavigate);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    await userEvent.type(usernameInput, "testUser");
    await userEvent.type(passwordInput, "Password");

    const loginButton = screen.getByRole("button", { name: "Login" });
    await userEvent.click(loginButton);

    expect(axios.get).toHaveBeenCalledWith();
  });

  // test("Should return successful signup form submission", async () => {
  //   globalThis.URL.createObjectURL = vitest.fn();

  //   render(<RouterProvider router={memoryRouter("/signup")} />);

  //   const profilePictureInput = screen.getByLabelText("Profile picture");
  //   const usernameInput = screen.getByLabelText("Username");
  //   const emailInput = screen.getByLabelText("Email");
  //   const passwordInput = screen.getByLabelText("Password");
  //   const confirmPasswordInput = screen.getByLabelText("Confirm password");

  //   await userEvent.upload(
  //     profilePictureInput,
  //     new File([new Blob([""])], "image.png", { type: "image/png" })
  //   );
  //   await userEvent.type(usernameInput, "testUser");
  //   await userEvent.type(emailInput, "Email@email.com");
  //   await userEvent.type(passwordInput, "Password");
  //   await userEvent.type(confirmPasswordInput, "Password");

  //   const signupButton = screen.getByRole("button", { name: "Signup" });
  //   await userEvent.click(signupButton);
  // });
});
