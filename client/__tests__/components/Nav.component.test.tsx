import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, Mock, test, vitest } from "vitest";
import { mockUser, Test } from "../utilities/Test.utilities";
import axios from "axios";

vitest.mock("axios");

describe("Nav component", () => {
  test("Should render nav bar", async () => {
    (axios.get as Mock).mockResolvedValueOnce({ data: mockUser });

    await act(async () => {
      render(<Test initialEntry="/" />);
    });

    const usernames = screen.getAllByText("testUser");

    usernames.forEach((username) => {
      expect(username).toBeInTheDocument();
    });
  });
});
