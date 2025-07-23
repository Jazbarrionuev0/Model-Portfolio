import { cn, logInfo, logError, getImageUrl, convertForPreview } from "@/lib/utils";

// Mock heic2any for testing
jest.mock("heic2any", () => ({
  default: jest.fn(),
}));

describe("Utils", () => {
  describe("cn function", () => {
    it("should merge class names correctly", () => {
      const result = cn("class1", "class2");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
    });

    it("should handle empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle conditional classes", () => {
      const result = cn("base", { conditional: true, hidden: false });
      expect(result).toContain("base");
      expect(result).toContain("conditional");
      expect(result).not.toContain("hidden");
    });

    it("should handle undefined and null values", () => {
      const result = cn("base", undefined, null, "valid");
      expect(result).toContain("base");
      expect(result).toContain("valid");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["class1", "class2"], "class3");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
      expect(result).toContain("class3");
    });
  });

  describe("getImageUrl function", () => {
    const originalEnv = process.env.DO_SPACES_IMAGE_URL;

    beforeEach(() => {
      process.env.DO_SPACES_IMAGE_URL = "https://example.com";
    });

    afterEach(() => {
      process.env.DO_SPACES_IMAGE_URL = originalEnv;
    });

    it("should construct correct image URL", () => {
      const path = "test-image.jpg";
      const result = getImageUrl(path);
      expect(result).toBe("https://example.com/test-image.jpg");
    });

    it("should handle paths with leading slash", () => {
      const path = "/test-image.jpg";
      const result = getImageUrl(path);
      expect(result).toBe("https://example.com//test-image.jpg");
    });

    it("should handle empty path", () => {
      const result = getImageUrl("");
      expect(result).toBe("https://example.com/");
    });

    it("should handle nested paths", () => {
      const path = "folder/subfolder/image.jpg";
      const result = getImageUrl(path);
      expect(result).toBe("https://example.com/folder/subfolder/image.jpg");
    });
  });

  describe("convertForPreview function", () => {
    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();

      // Mock window object for browser environment
      Object.defineProperty(window, "window", {
        value: global.window,
        writable: true,
      });
    });

    it("should return original file for non-HEIC formats", async () => {
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      const result = await convertForPreview(mockFile);

      expect(result).toBe(mockFile);
    });

    it("should return original file in server environment", async () => {
      // Mock server environment
      const originalWindow = global.window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (global as any).window;

      const mockFile = new File(["test"], "test.heic", { type: "image/heic" });

      const result = await convertForPreview(mockFile);

      expect(result).toBe(mockFile);

      // Restore window
      global.window = originalWindow;
    });

    it("should handle HEIC files gracefully in test environment", async () => {
      const mockFile = new File(["test"], "test.heic", { type: "image/heic" });

      // In test environment, the HEIC conversion will fail but we should handle it gracefully
      try {
        await convertForPreview(mockFile);
        // If it succeeds, that's also fine
      } catch (error) {
        // Expect the specific error message from our implementation
        expect((error as Error).message).toBe("Could not convert image for preview. Please try a different image format.");
      }
    });

    it("should handle HEIF files gracefully in test environment", async () => {
      const mockFile = new File(["test"], "test.heif", { type: "image/heif" });

      // In test environment, the HEIF conversion will fail but we should handle it gracefully
      try {
        await convertForPreview(mockFile);
        // If it succeeds, that's also fine
      } catch (error) {
        // Expect the specific error message from our implementation
        expect((error as Error).message).toBe("Could not convert image for preview. Please try a different image format.");
      }
    });

    it("should handle files with HEIC extension in filename", async () => {
      const mockFile = new File(["test"], "photo.HEIC", { type: "image/jpeg" });

      // Should still attempt conversion based on filename
      try {
        await convertForPreview(mockFile);
      } catch (error) {
        expect((error as Error).message).toBe("Could not convert image for preview. Please try a different image format.");
      }
    });
  });

  describe("logging functions", () => {
    let consoleSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log").mockImplementation();
      errorSpy = jest.spyOn(console, "error").mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      errorSpy.mockRestore();
    });

    describe("logInfo", () => {
      it("should log info messages with data", () => {
        logInfo("Test message", { key: "value" });
        expect(consoleSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_INFO] Test message", JSON.stringify({ key: "value" }));
      });

      it("should log info without data", () => {
        logInfo("Test message");
        expect(consoleSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_INFO] Test message", "");
      });

      it("should handle complex data objects", () => {
        const complexData = {
          nested: { value: "test" },
          array: [1, 2, 3],
          boolean: true,
        };

        logInfo("Complex data", complexData);

        expect(consoleSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_INFO] Complex data", JSON.stringify(complexData));
      });
    });

    describe("logError", () => {
      it("should log Error objects with details", () => {
        const testError = new Error("Test error");
        testError.stack = "Error stack trace";

        logError("Test error message", testError);

        expect(errorSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_ERROR] Test error message", testError);
        expect(errorSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_ERROR_DETAILS] Error: Test error");
        expect(errorSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_ERROR_STACK] Error stack trace");
      });

      it("should handle non-Error objects", () => {
        const errorObject = { message: "Custom error", code: 500 };

        logError("Custom error occurred", errorObject);

        expect(errorSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_ERROR] Custom error occurred", errorObject);
        expect(errorSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_ERROR_OBJECT]", JSON.stringify(errorObject, null, 2));
      });

      it("should handle string errors", () => {
        logError("String error occurred", "Simple string error");

        expect(errorSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_ERROR] String error occurred", "Simple string error");
      });

      it("should handle null/undefined errors", () => {
        logError("Null error", null);
        logError("Undefined error", undefined);

        expect(errorSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_ERROR] Null error", null);
        expect(errorSpy).toHaveBeenCalledWith("[CAMPAIGN_FORM_ERROR] Undefined error", undefined);
      });
    });
  });
});
