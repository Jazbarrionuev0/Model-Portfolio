import { renderHook, act } from "@testing-library/react";
import { useToast } from "@/hooks/use-toast";
describe("useToast hook", () => {
  it("should initialize with empty toasts array", () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });
  it("should have toast function", () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.toast).toBe("function");
  });
  it("should have dismiss function", () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.dismiss).toBe("function");
  });
  it("should add a toast when toast function is called", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({
        title: "Test Toast",
        description: "This is a test toast",
      });
    });
    expect(result.current.toasts.length).toBeGreaterThan(0);
    if (result.current.toasts.length > 0) {
      expect(result.current.toasts[0].title).toBe("Test Toast");
      expect(result.current.toasts[0].description).toBe("This is a test toast");
    }
  });
});
