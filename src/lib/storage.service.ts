import { Image } from "@/types/image";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { logError, logInfo } from "./utils";

class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private endpoint: string;

  constructor(endpoint: string, region: string, key: string, secret: string, bucket: string) {
    logInfo("Initializing StorageService", {
      endpoint,
      region,
      bucket,
      keyProvided: !!key,
      secretProvided: !!secret,
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
    });

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
      logInfo("StorageService initialized successfully");
    } catch (error) {
      logError("Failed to initialize S3Client", error);
      throw error;
    }
  }

  async upload(file: File): Promise<Omit<Image, "id">> {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}.${extension}`;

    logInfo("Starting S3 upload", {
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
      console.log("arrayBuffer", arrayBuffer);
      // Convert ArrayBuffer to Buffer for S3
      const buffer = Buffer.from(arrayBuffer);
      debugger;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: buffer,
        ACL: "public-read",
        ContentType: file.type || this.getMimeType(extension),
      });

      logInfo("Sending PutObjectCommand to S3", {
        bucket: this.bucket,
        key: filename,
        contentType: file.type || this.getMimeType(extension),
        aclSetting: "public-read",
      });

      const result = await this.s3Client.send(command);

      logInfo("S3 upload successful", {
        filename,
        eTag: result.ETag,
        statusCode: result.$metadata?.httpStatusCode,
      });
    } catch (error) {
      logError("S3 upload error", error);

      if (error && typeof error === "object" && "$metadata" in error) {
        const metadata = (error as { $metadata: Record<string, unknown> }).$metadata;
        logError("S3 error metadata", {
          requestId: metadata?.requestId,
          cfId: metadata?.cfId,
          extendedRequestId: metadata?.extendedRequestId,
          httpStatusCode: metadata?.httpStatusCode,
          attempts: metadata?.attempts,
          totalRetryDelay: metadata?.totalRetryDelay,
        });
      }

      throw new Error("Failed to upload file to storage");
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

      logInfo("Starting S3 delete operation", { imagePath, extractedFilename: filename });

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: filename,
        })
      );

      logInfo("S3 delete successful", { filename });
    } catch (error) {
      logError("S3 delete error", error);
      throw new Error("Failed to delete file from storage");
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

const { DO_SPACES_ENDPOINT, DO_SPACES_REGION, DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_BUCKET } = process.env;

console.log({
  DO_SPACES_ENDPOINT,
  DO_SPACES_REGION,
  DO_SPACES_KEY,
  DO_SPACES_SECRET,
  DO_SPACES_BUCKET,
});

logInfo("Environment variables check", {
  endpointProvided: !!DO_SPACES_ENDPOINT,
  regionProvided: !!DO_SPACES_REGION,
  keyProvided: !!DO_SPACES_KEY,
  secretProvided: !!DO_SPACES_SECRET,
  bucketProvided: !!DO_SPACES_BUCKET,
  environment: process.env.NODE_ENV,
  isVercel: !!process.env.VERCEL,
} as Record<string, unknown>);

const storageService = new StorageService(
  String(DO_SPACES_ENDPOINT),
  String(DO_SPACES_REGION),
  String(DO_SPACES_KEY),
  String(DO_SPACES_SECRET),
  String(DO_SPACES_BUCKET)
);

export default storageService;
