import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { memoryRouter } from "../utilities/router";
import userEvent from "@testing-library/user-event";

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

  test("Should submit login form", async () => {
    render(<RouterProvider router={memoryRouter("/")} />);

    const loginButton = screen.getByRole("button", { name: "Login" });
    userEvent.click(loginButton);

    screen.debug(loginButton);
  });
});
