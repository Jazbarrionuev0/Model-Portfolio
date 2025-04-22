"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Image } from "@/types/image";
import { logError, logInfo } from "@/lib/utils";
import heicConvert from "heic-convert";
import sharp from "sharp";

export async function uploadImageAction(file: File): Promise<Image> {
  if (!file) {
    throw new Error("No file provided");
  }

  const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
  let extension = file.name.split(".").pop()?.toLowerCase() || "";
  const bytes = await file.arrayBuffer();
  let buffer = Buffer.from(bytes);
  let contentType = file.type;

  // Check if the file is HEIC or HEIF format
  const isHeic = ["heic", "heif"].includes(extension) || file.type === "image/heic" || file.type === "image/heif";

  if (isHeic) {
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
      logInfo("HEIC/HEIF conversion successful", { newType: contentType });
    } catch (conversionError) {
      logError("HEIC/HEIF conversion failed, trying Sharp as fallback", conversionError);

      try {
        // Fallback to using Sharp for conversion
        const jpegBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();

        buffer = jpegBuffer;
        extension = "jpg";
        contentType = "image/jpeg";
        logInfo("HEIC/HEIF conversion with Sharp successful", { newType: contentType });
      } catch (sharpError) {
        logError("All conversion methods failed", sharpError);
        throw new Error("Failed to convert image format");
      }
    }
  }

  // Use the potentially modified extension for the filename
  const filename = `${timestamp}.${extension}`;

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
    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: filename,
      Body: buffer,
      ACL: "public-read",
      ContentType: contentType, // Use the potentially updated content type
    });

    await s3Client.send(command);

    const imageUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT?.replace("https://", "")}/${filename}`;

    return {
      id: Date.now(),
      alt: file.name,
      url: imageUrl,
    };
  } catch (error) {
    logError("Error uploading image", error);
    throw new Error("Failed to upload image");
  }
}
