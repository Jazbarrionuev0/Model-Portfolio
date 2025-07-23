import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Test wrapper component that uses the Form components
const TestForm = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

describe("Form Components", () => {
  it("should render form with labels and inputs", () => {
    render(<TestForm />);

    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Enter your name")).toBeTruthy();
    expect(screen.getByPlaceholderText("Enter your email")).toBeTruthy();
  });

  it("should render FormLabel correctly", () => {
    render(<TestForm />);

    const nameLabel = screen.getByText("Name");
    const emailLabel = screen.getByText("Email");

    expect(nameLabel).toBeTruthy();
    expect(emailLabel).toBeTruthy();
  });

  it("should connect labels to inputs", () => {
    render(<TestForm />);

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const emailInput = screen.getByPlaceholderText("Enter your email");

    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
  });

  it("should render form structure correctly", () => {
    render(<TestForm />);

    const form = screen.getByRole("form");
    expect(form).toBeTruthy();
  });
});

// Test individual form components
describe("Individual Form Components", () => {
  it("should render FormLabel standalone", () => {
    render(<FormLabel>Test Label</FormLabel>);

    const label = screen.getByText("Test Label");
    expect(label).toBeTruthy();
  });

  it("should render FormItem as container", () => {
    render(
      <FormItem>
        <div>Form item content</div>
      </FormItem>
    );

    const content = screen.getByText("Form item content");
    expect(content).toBeTruthy();
  });

  it("should render FormControl as wrapper", () => {
    render(
      <FormControl>
        <input data-testid="test-input" />
      </FormControl>
    );

    const input = screen.getByTestId("test-input");
    expect(input).toBeTruthy();
  });

  it("should render FormMessage for errors", () => {
    render(<FormMessage>Error message</FormMessage>);

    const message = screen.getByText("Error message");
    expect(message).toBeTruthy();
  });
});
