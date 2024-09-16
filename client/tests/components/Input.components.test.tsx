import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "../../src/components/Input.components";

describe("Input component", () => {
  test("Should render label and input tag", () => {
    render(<Input id="test" title="Test" placeholder="Test" />);
    expect(screen.queryByLabelText("Test")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Test")).toBeInTheDocument();
  });
});
