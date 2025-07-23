import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeTruthy();
  });

  it("should render button with different variants", () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByRole("button")).toBeTruthy();

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole("button")).toBeTruthy();

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("should render disabled button", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveProperty("disabled", true);
  });

  it("should render button with different sizes", () => {
    const { rerender } = render(<Button size="default">Default Size</Button>);
    expect(screen.getByRole("button")).toBeTruthy();

    rerender(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toBeTruthy();

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("should handle onClick events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
