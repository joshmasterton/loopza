import { render, screen } from "@testing-library/react";
import { describe, expect, Mock, test, vitest } from "vitest";
import { act } from "react";
import { Test } from "../utilities/Test.utilities";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { API_URL } from "../../src/utilities/request.utilities";

vitest.mock("axios");

describe("Auth page", () => {
  test("Should render correct auth page", async () => {
    (axios.get as Mock).mockResolvedValueOnce({});

    await act(async () => {
      render(<Test initialEntry="/login" />);
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
    (axios.get as Mock).mockResolvedValueOnce({});

    await act(async () => {
      render(<Test initialEntry="/login" />);
    });

    const loginButton = screen.getByRole("button", { name: "Login" });
    await userEvent.click(loginButton);

    expect(screen.queryByText("Email required")).toBeInTheDocument();
    expect(
      screen.queryByText("Password must be at least 6 characters")
    ).toBeInTheDocument();
  });

  test("Should return errors on invalid signup form submission", async () => {
    (axios.get as Mock).mockResolvedValueOnce({});

    await act(async () => {
      render(<Test initialEntry="/signup" />);
    });

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
    (axios.get as Mock).mockResolvedValueOnce({});
    (axios.get as Mock).mockResolvedValueOnce({});

    await act(async () => {
      render(<Test initialEntry="/login" />);
    });

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await userEvent.type(emailInput, "testUser@email.com");
    await userEvent.type(passwordInput, "Password");

    const loginButton = screen.getByRole("button", { name: "Login" });
    await userEvent.click(loginButton);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/auth/login`,
      { email: "testUser@email.com", password: "Password" },
      { withCredentials: true }
    );
  });

  test("Should return successful signup form submission", async () => {
    (axios.get as Mock).mockResolvedValueOnce({});
    (axios.get as Mock).mockResolvedValueOnce({});
    globalThis.URL.createObjectURL = vitest.fn();

    await act(async () => {
      render(<Test initialEntry="/signup" />);
    });

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

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/auth/signup`,
      expect.any(FormData),
      { withCredentials: true }
    );
  });
});
