"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Image } from "@/types/image";
import { logError, logInfo } from "@/lib/utils";
import { logger } from "@/lib/logger";
import heicConvert from "heic-convert";
import sharp from "sharp";

export async function uploadImageAction(file: File): Promise<Image> {
  if (!file) {
    const error = new Error("No file provided");
    logger.error("Upload failed: No file provided", "UPLOAD", error);
    throw error;
  }

  logger.info("Starting image upload", "UPLOAD", {
    filename: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
  let extension = file.name.split(".").pop()?.toLowerCase() || "";
  const bytes = await file.arrayBuffer();
  let buffer = Buffer.from(bytes);
  let contentType = file.type;

  // Check if the file is HEIC or HEIF format
  const isHeic = ["heic", "heif"].includes(extension) || file.type === "image/heic" || file.type === "image/heif";

  if (isHeic) {
    logger.info("Converting HEIC/HEIF image to JPEG", "UPLOAD", {
      filename: file.name,
      originalType: file.type,
    });
    logInfo("Converting HEIC/HEIF image to JPEG", { filename: file.name, originalType: file.type });
    try {
      // Convert HEIC/HEIF to JPEG using heic-convert
      const jpegBuffer = await heicConvert({
        buffer: buffer as unknown as ArrayBuffer, // Type casting to satisfy heic-convert's type requirements
        format: "JPEG",
        quality: 0.9,
      });

      // Update our variables with the converted image data
      buffer = Buffer.from(jpegBuffer); // Convert result back to Buffer
      extension = "jpg";
      contentType = "image/jpeg";
      logger.info("HEIC/HEIF conversion successful", "UPLOAD", { newType: contentType });
      logInfo("HEIC/HEIF conversion successful", { newType: contentType });
    } catch (conversionError) {
      logger.warn(
        "HEIC/HEIF conversion failed, trying Sharp as fallback",
        "UPLOAD",
        conversionError instanceof Error ? conversionError : new Error(String(conversionError))
      );
      logError("HEIC/HEIF conversion failed, trying Sharp as fallback", conversionError);

      try {
        // Fallback to using Sharp for conversion
        const jpegBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();

        buffer = jpegBuffer;
        extension = "jpg";
        contentType = "image/jpeg";
        logger.info("HEIC/HEIF conversion with Sharp successful", "UPLOAD", { newType: contentType });
        logInfo("HEIC/HEIF conversion with Sharp successful", { newType: contentType });
      } catch (sharpError) {
        const error = new Error("Failed to convert image format");
        logger.error("All image conversion methods failed", "UPLOAD", error, {
          filename: file.name,
          originalType: file.type,
          heicError: conversionError instanceof Error ? conversionError.message : String(conversionError),
          sharpError: sharpError instanceof Error ? sharpError.message : String(sharpError),
        });
        logError("All conversion methods failed", sharpError);
        throw error;
      }
    }
  }

  // Use the potentially modified extension for the filename
  const filename = `${timestamp}.${extension}`;

  logger.info("Creating S3 client for upload", "UPLOAD", {
    filename,
    hasEndpoint: !!process.env.DO_SPACES_ENDPOINT,
    hasRegion: !!process.env.DO_SPACES_REGION,
    hasKey: !!process.env.DO_SPACES_KEY,
    hasSecret: !!process.env.DO_SPACES_SECRET,
    hasBucket: !!process.env.DO_SPACES_BUCKET,
  });

  const s3Client = new S3Client({
    endpoint: process.env.DO_SPACES_ENDPOINT,
    region: process.env.DO_SPACES_REGION,
    credentials: {
      accessKeyId: process.env.DO_SPACES_KEY || "",
      secretAccessKey: process.env.DO_SPACES_SECRET || "",
    },
    forcePathStyle: true,
  });

  try {
    logger.info("Preparing S3 upload command", "UPLOAD", {
      bucket: process.env.DO_SPACES_BUCKET,
      key: filename,
      contentType,
      bufferSize: buffer.length,
    });

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: filename,
      Body: buffer,
      ACL: "public-read",
      ContentType: contentType, // Use the potentially updated content type
    });

    const result = await s3Client.send(command);

    const imageUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT?.replace("https://", "")}/${filename}`;

    logger.info("Image upload successful", "UPLOAD", {
      filename,
      imageUrl,
      statusCode: result.$metadata?.httpStatusCode,
      eTag: result.ETag,
    });

    return {
      id: Date.now(),
      alt: file.name,
      url: imageUrl,
    };
  } catch (error) {
    const uploadError = error instanceof Error ? error : new Error(String(error));
    logger.error("Image upload failed", "UPLOAD", uploadError, {
      filename,
      bucket: process.env.DO_SPACES_BUCKET,
      contentType,
      bufferSize: buffer.length,
      errorMessage: uploadError.message,
      hasEndpoint: !!process.env.DO_SPACES_ENDPOINT,
      hasCredentials: !!(process.env.DO_SPACES_KEY && process.env.DO_SPACES_SECRET),
    });
    logError("Error uploading image", error);
    throw new Error("Failed to upload image");
  }
}
