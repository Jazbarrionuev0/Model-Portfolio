import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label Component", () => {
  it("renders label element", () => {
    render(<Label>Test Label</Label>);

    const label = screen.getByText("Test Label");
    expect(label).toBeTruthy();
  });

  it("renders as label element by default", () => {
    render(<Label data-testid="label">Test Label</Label>);

    const label = screen.getByTestId("label");
    expect(label.tagName).toBe("LABEL");
  });

  it("applies custom className", () => {
    render(
      <Label className="custom-class" data-testid="label">
        Test Label
      </Label>
    );

    const label = screen.getByTestId("label");
    expect(label.className).toContain("custom-class");
  });

  it("applies default styling classes", () => {
    render(<Label data-testid="label">Test Label</Label>);

    const label = screen.getByTestId("label");
    expect(label.className).toContain("text-sm");
    expect(label.className).toContain("font-medium");
    expect(label.className).toContain("leading-none");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Label ref={ref}>Test Label</Label>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("accepts htmlFor attribute", () => {
    render(
      <Label htmlFor="test-input" data-testid="label">
        Test Label
      </Label>
    );

    const label = screen.getByTestId("label");
    expect(label.getAttribute("for")).toBe("test-input");
  });

  it("handles children correctly", () => {
    render(
      <Label data-testid="label">
        <span>Child Element</span>
        Text Content
      </Label>
    );

    const label = screen.getByTestId("label");
    expect(label.textContent).toBe("Child ElementText Content");
    expect(screen.getByText("Child Element")).toBeTruthy();
  });

  it("supports all Radix Label props", () => {
    render(
      <Label asChild data-testid="label">
        <div>Custom Element</div>
      </Label>
    );

    const element = screen.getByTestId("label");
    expect(element.tagName).toBe("DIV");
    expect(element.textContent).toBe("Custom Element");
  });

  it("can be used with form controls", () => {
    render(
      <div>
        <Label htmlFor="input-field">Label Text</Label>
        <input id="input-field" type="text" />
      </div>
    );

    const label = screen.getByText("Label Text");
    const input = screen.getByRole("textbox");

    expect(label.getAttribute("for")).toBe("input-field");
    expect(input.getAttribute("id")).toBe("input-field");
  });
});
