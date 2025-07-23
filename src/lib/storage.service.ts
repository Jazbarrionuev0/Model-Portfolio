import { Image } from "@/types/image";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "./logger";

class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private endpoint: string;

  constructor(endpoint: string, region: string, key: string, secret: string, bucket: string) {
    logger.info("Initializing StorageService", "STORAGE", {
      endpoint,
      region,
      bucket,
      keyProvided: !!key,
      secretProvided: !!secret,
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
    });

    // Validate required parameters
    if (!endpoint || !region || !key || !secret || !bucket) {
      const missing = [];
      if (!endpoint) missing.push("endpoint");
      if (!region) missing.push("region");
      if (!key) missing.push("key");
      if (!secret) missing.push("secret");
      if (!bucket) missing.push("bucket");

      const error = new Error(`Missing required S3 configuration: ${missing.join(", ")}`);
      logger.error("StorageService initialization failed", "STORAGE", error, { missing });
      throw error;
    }

    try {
      this.s3Client = new S3Client({
        endpoint: endpoint,
        region: region,
        credentials: {
          accessKeyId: key,
          secretAccessKey: secret,
        },
        forcePathStyle: true,
      });
      this.bucket = bucket;
      this.endpoint = endpoint;
      logger.info("StorageService initialized successfully", "STORAGE");
    } catch (error) {
      logger.error("Failed to initialize S3Client", "STORAGE", error as Error);
      throw error;
    }
  }

  async upload(file: File): Promise<Omit<Image, "id">> {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const extension = file.name.split(".").pop() || "";
    const filename = `${timestamp}.${extension}`;

    logger.info("Starting S3 upload", "STORAGE", {
      originalFilename: file.name,
      generatedFilename: filename,
      fileSize: file.size,
      fileType: file.type,
      bucket: this.bucket,
      endpoint: this.endpoint,
    });

    try {
      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      logger.debug("File converted to ArrayBuffer", "STORAGE", {
        arrayBufferSize: arrayBuffer.byteLength,
      });

      // Convert ArrayBuffer to Buffer for S3
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: buffer,
        ACL: "public-read",
        ContentType: file.type || this.getMimeType(extension),
      });

      logger.info("Sending PutObjectCommand to S3", "STORAGE", {
        bucket: this.bucket,
        key: filename,
        contentType: file.type || this.getMimeType(extension),
        aclSetting: "public-read",
        bufferSize: buffer.length,
      });

      const result = await this.s3Client.send(command);

      logger.info("S3 upload successful", "STORAGE", {
        filename,
        eTag: result.ETag,
        statusCode: result.$metadata?.httpStatusCode,
      });
    } catch (error) {
      logger.error("S3 upload failed", "STORAGE", error as Error, {
        bucket: this.bucket,
        filename,
        fileType: file.type,
        fileSize: file.size,
      });

      if (error && typeof error === "object" && "$metadata" in error) {
        const metadata = (error as { $metadata: Record<string, unknown> }).$metadata;
        logger.error("S3 error metadata", "STORAGE", undefined, {
          requestId: metadata?.requestId,
          cfId: metadata?.cfId,
          extendedRequestId: metadata?.extendedRequestId,
          httpStatusCode: metadata?.httpStatusCode,
          attempts: metadata?.attempts,
          totalRetryDelay: metadata?.totalRetryDelay,
        });
      }

      throw new Error(`Failed to upload file to storage: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    const image: Omit<Image, "id"> = {
      alt: file.name,
      url: this.getImageUrl(filename),
    };

    return image;
  }

  async delete(imagePath: string): Promise<void> {
    try {
      const urlParts = imagePath.split("/");
      const filename = urlParts[urlParts.length - 1];

      logger.info("Starting S3 delete operation", "STORAGE", {
        imagePath,
        extractedFilename: filename,
      });

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: filename,
        })
      );

      logger.info("S3 delete successful", "STORAGE", { filename });
    } catch (error) {
      logger.error("S3 delete failed", "STORAGE", error as Error, { imagePath });
      throw new Error(`Failed to delete file from storage: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/api/images/")) {
      const filename = imagePath.replace("/api/images/", "");
      return `https://${this.bucket}.${this.endpoint}/${filename}`;
    }

    const path = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    return `https://${this.bucket}.${this.endpoint}/${path}`;
  }

  private getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };

    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  }
}

// Environment variables validation
const { DO_SPACES_ENDPOINT, DO_SPACES_REGION, DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_BUCKET } = process.env;

logger.info("Environment variables check", "STORAGE", {
  endpointProvided: !!DO_SPACES_ENDPOINT,
  regionProvided: !!DO_SPACES_REGION,
  keyProvided: !!DO_SPACES_KEY,
  secretProvided: !!DO_SPACES_SECRET,
  bucketProvided: !!DO_SPACES_BUCKET,
  environment: process.env.NODE_ENV,
  isVercel: !!process.env.VERCEL,
});

// Validate configuration before creating service
if (!DO_SPACES_ENDPOINT || !DO_SPACES_REGION || !DO_SPACES_KEY || !DO_SPACES_SECRET || !DO_SPACES_BUCKET) {
  const missing = [];
  if (!DO_SPACES_ENDPOINT) missing.push("DO_SPACES_ENDPOINT");
  if (!DO_SPACES_REGION) missing.push("DO_SPACES_REGION");
  if (!DO_SPACES_KEY) missing.push("DO_SPACES_KEY");
  if (!DO_SPACES_SECRET) missing.push("DO_SPACES_SECRET");
  if (!DO_SPACES_BUCKET) missing.push("DO_SPACES_BUCKET");

  const error = new Error(`Missing required environment variables: ${missing.join(", ")}`);
  logger.error("StorageService configuration error", "STORAGE", error, { missing });
  throw error;
}

const storageService = new StorageService(DO_SPACES_ENDPOINT, DO_SPACES_REGION, DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_BUCKET);

export default storageService;
