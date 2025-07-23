import { middleware, config } from "@/middleware";

// Mock Next.js server functions
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(() => ({ type: "next" })),
    redirect: jest.fn((url) => ({ type: "redirect", url })),
  },
}));

describe("Middleware", () => {
  // Test the middleware configuration
  describe("config", () => {
    it("has correct matcher configuration", () => {
      expect(config.matcher).toEqual(["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"]);
    });

    it("should have proper matcher pattern structure", () => {
      const matcher = config.matcher[0];

      // Check it's a string that looks like a regex pattern
      expect(typeof matcher).toBe("string");
      expect(matcher.startsWith("/")).toBe(true);
      expect(matcher.endsWith(")")).toBe(true);

      // Check it contains expected exclusions
      expect(matcher).toContain("api");
      expect(matcher).toContain("_next/static");
      expect(matcher).toContain("_next/image");
      expect(matcher).toContain("favicon.ico");
      expect(matcher).toContain("sitemap.xml");
      expect(matcher).toContain("robots.txt");
    });
  });

  describe("middleware function", () => {
    it("should be a function", () => {
      expect(typeof middleware).toBe("function");
    });

    it("should be async", () => {
      expect(middleware.constructor.name).toBe("AsyncFunction");
    });
  });
});
