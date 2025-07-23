import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import storageService from "@/lib/storage.service";

// Mock AWS S3 Client
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

// Mock utils
jest.mock("@/lib/utils", () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
}));

describe("StorageService", () => {
  let mockS3Send: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockS3Send = jest.fn();
    (S3Client as jest.Mock).mockImplementation(() => ({
      send: mockS3Send,
    }));
  });

  describe("upload", () => {
    it("should upload file successfully", async () => {
      const mockFile = new File(["test content"], "test.jpg", { type: "image/jpeg" });
      const mockResponse = { ETag: '"mock-etag"' };

      mockS3Send.mockResolvedValue(mockResponse);

      const result = await storageService.upload(mockFile);

      expect(result).toHaveProperty("url");
      expect(result).toHaveProperty("alt");
      expect(result.alt).toBe("test.jpg");
      expect(mockS3Send).toHaveBeenCalledTimes(1);
      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: expect.any(String),
        Key: expect.any(String),
        Body: expect.any(Buffer),
        ContentType: "image/jpeg",
        ACL: "public-read",
      });
    });

    it("should handle upload errors", async () => {
      const mockFile = new File(["test content"], "test.jpg", { type: "image/jpeg" });
      const error = new Error("Upload failed");

      mockS3Send.mockRejectedValue(error);

      await expect(storageService.upload(mockFile)).rejects.toThrow("Upload failed");
    });

    it("should generate correct file path and URL", async () => {
      const mockFile = new File(["test content"], "test-image.jpg", { type: "image/jpeg" });
      const mockResponse = { ETag: '"mock-etag"' };

      mockS3Send.mockResolvedValue(mockResponse);

      const result = await storageService.upload(mockFile);

      expect(result.url).toMatch(/test-image\.jpg$/);
      expect(result.alt).toBe("test-image.jpg");
    });

    it("should handle different file types", async () => {
      const mockFile = new File(["test content"], "test.png", { type: "image/png" });
      const mockResponse = { ETag: '"mock-etag"' };

      mockS3Send.mockResolvedValue(mockResponse);

      await storageService.upload(mockFile);

      expect(PutObjectCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          ContentType: "image/png",
        })
      );
    });
  });

  describe("delete", () => {
    it("should delete file successfully", async () => {
      const imagePath = "test-folder/test-image.jpg";
      const mockResponse = {};

      mockS3Send.mockResolvedValue(mockResponse);

      await storageService.delete(imagePath);

      expect(mockS3Send).toHaveBeenCalledTimes(1);
      expect(DeleteObjectCommand).toHaveBeenCalledWith({
        Bucket: expect.any(String),
        Key: imagePath,
      });
    });

    it("should handle delete errors", async () => {
      const imagePath = "test-folder/test-image.jpg";
      const error = new Error("Delete failed");

      mockS3Send.mockRejectedValue(error);

      await expect(storageService.delete(imagePath)).rejects.toThrow("Delete failed");
    });
  });

  describe("getImageUrl", () => {
    it("should return correct image URL for valid path", () => {
      const imagePath = "test-folder/test-image.jpg";
      const result = storageService.getImageUrl(imagePath);

      expect(result).toContain(imagePath);
      expect(typeof result).toBe("string");
    });

    it("should handle null path", () => {
      const result = storageService.getImageUrl(null);

      expect(typeof result).toBe("string");
      expect(result).not.toContain("null");
    });

    it("should handle empty path", () => {
      const result = storageService.getImageUrl("");

      expect(typeof result).toBe("string");
    });
  });

  describe("getMimeType", () => {
    it("should return correct MIME types for common extensions", () => {
      // Since getMimeType is private, we test it indirectly through upload
      const testCases = [
        { extension: "jpg", expected: "image/jpeg" },
        { extension: "png", expected: "image/png" },
        { extension: "gif", expected: "image/gif" },
        { extension: "webp", expected: "image/webp" },
      ];

      testCases.forEach(async ({ extension, expected }) => {
        const mockFile = new File(["test"], `test.${extension}`, { type: expected });
        mockS3Send.mockResolvedValue({ ETag: '"mock-etag"' });

        await storageService.upload(mockFile);

        expect(PutObjectCommand).toHaveBeenCalledWith(
          expect.objectContaining({
            ContentType: expected,
          })
        );
      });
    });
  });
});
