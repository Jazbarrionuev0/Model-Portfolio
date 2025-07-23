import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  it("renders input element", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input.className).toContain("custom-class");
  });

  it("handles different input types", () => {
    const { rerender } = render(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId("input").getAttribute("type")).toBe("password");

    rerender(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId("input").getAttribute("type")).toBe("email");

    rerender(<Input type="number" data-testid="input" />);
    expect(screen.getByTestId("input").getAttribute("type")).toBe("number");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input data-testid="input" />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    await user.type(input, "Hello World");

    expect(input.value).toBe("Hello World");
  });

  it("can be disabled", () => {
    render(<Input disabled data-testid="input" />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it("accepts placeholder text", () => {
    render(<Input placeholder="Enter text here" data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input.getAttribute("placeholder")).toBe("Enter text here");
  });

  it("applies default classes", () => {
    render(<Input data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input.className).toContain("flex");
    expect(input.className).toContain("h-9");
    expect(input.className).toContain("w-full");
    expect(input.className).toContain("rounded-md");
  });

  it("handles controlled input", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<Input value="controlled" onChange={onChange} data-testid="input" />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    expect(input.value).toBe("controlled");

    await user.type(input, "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("handles form attributes", () => {
    render(<Input name="test-input" required data-testid="input" />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    expect(input.getAttribute("name")).toBe("test-input");
    expect(input.required).toBe(true);
  });
});
