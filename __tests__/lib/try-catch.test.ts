import { tryCatch } from "@/lib/try-catch";

describe("tryCatch Utility", () => {
  describe("Success cases", () => {
    it("should return success result for resolved promise", async () => {
      const promise = Promise.resolve("success");

      const result = await tryCatch(promise);

      expect(result.data).toBe("success");
      expect(result.error).toBeNull();
    });

    it("should handle complex data types", async () => {
      const mockData = { id: 1, name: "Test", items: [1, 2, 3] };
      const promise = Promise.resolve(mockData);

      const result = await tryCatch(promise);

      expect(result.data).toEqual(mockData);
      expect(result.error).toBeNull();
    });

    it("should handle async function success", async () => {
      const asyncFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "async success";
      };

      const result = await tryCatch(asyncFunction());

      expect(result.data).toBe("async success");
      expect(result.error).toBeNull();
    });
  });

  describe("Error cases", () => {
    it("should return error result for rejected promise", async () => {
      const error = new Error("Test error");
      const promise = Promise.reject(error);

      const result = await tryCatch(promise);

      expect(result.data).toBeNull();
      expect(result.error).toBe(error);
    });

    it("should handle string errors", async () => {
      const promise = Promise.reject("String error");

      const result = await tryCatch(promise);

      expect(result.data).toBeNull();
      expect(result.error).toBe("String error");
    });

    it("should handle custom error types", async () => {
      class CustomError extends Error {
        code: number;
        constructor(message: string, code: number) {
          super(message);
          this.code = code;
        }
      }

      const customError = new CustomError("Custom error", 404);
      const promise = Promise.reject(customError);

      const result = await tryCatch<string, CustomError>(promise);

      expect(result.data).toBeNull();
      expect(result.error).toBe(customError);
      expect(result.error?.code).toBe(404);
    });

    it("should handle async function errors", async () => {
      const asyncFunction = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw new Error("Async error");
      };

      const result = await tryCatch(asyncFunction());

      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe("Async error");
    });
  });

  describe("Type safety", () => {
    it("should maintain correct types for success case", async () => {
      const promise = Promise.resolve(42);

      const result = await tryCatch(promise);

      if (result.error === null) {
        // TypeScript should know result.data is number
        expect(typeof result.data).toBe("number");
        expect(result.data + 1).toBe(43);
      }
    });

    it("should maintain correct types for error case", async () => {
      const promise = Promise.reject(new Error("Test"));

      const result = await tryCatch(promise);

      if (result.data === null) {
        // TypeScript should know result.error exists
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe("Test");
      }
    });
  });

  describe("Real-world scenarios", () => {
    it("should handle database operations", async () => {
      const mockDatabaseCall = async () => {
        // Simulate database call
        if (Math.random() > 0.5) {
          return { id: 1, name: "User" };
        } else {
          throw new Error("Database connection failed");
        }
      };

      const result = await tryCatch(mockDatabaseCall());

      // Should handle both success and error cases
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("error");
      expect(result.data === null || result.error === null).toBe(true);
    });

    it("should handle API calls", async () => {
      const mockApiCall = async () => {
        // Simulate API call that might fail
        const response = await fetch("https://invalid-url-for-testing.com");
        if (!response.ok) throw new Error("API call failed");
        return response.json();
      };

      const result = await tryCatch(mockApiCall());

      // Should gracefully handle network errors
      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });
});
