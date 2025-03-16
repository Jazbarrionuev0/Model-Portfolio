"use server";

import { revalidatePath } from "next/cache";
import { Image } from "@/types/image";
import { Database } from "@/types/database";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import StorageService from "@/lib/storage.service";

const DB_PATH = join(process.cwd(), "data", "db.json");
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

// Helper function for consistent logging
function logInfo(message: string, data?: Record<string, unknown>): void {
  console.log(`[IMAGE_UPLOAD_INFO] ${message}`, data ? JSON.stringify(data) : "");
}

function logError(message: string, error: unknown): void {
  console.error(`[IMAGE_UPLOAD_ERROR] ${message}`, error);
  // Log additional error details if available
  if (error instanceof Error) {
    console.error(`[IMAGE_UPLOAD_ERROR_DETAILS] ${error.name}: ${error.message}`);
    console.error(`[IMAGE_UPLOAD_ERROR_STACK] ${error.stack}`);
  } else if (typeof error === "object" && error !== null) {
    console.error("[IMAGE_UPLOAD_ERROR_OBJECT]", JSON.stringify(error, null, 2));
  }
}

async function readDB(): Promise<Database> {
  try {
    logInfo("Reading database from path", { path: DB_PATH });
    const content = await readFile(DB_PATH, "utf-8");
    return JSON.parse(content) as Database;
  } catch (error) {
    logError("Error reading database", error);
    throw new Error("Database read error");
  }
}

async function writeDB(data: Database): Promise<void> {
  try {
    logInfo("Writing to database", { path: DB_PATH });
    await writeFile(DB_PATH, JSON.stringify(data, null, 2));
    logInfo("Database write successful");
  } catch (error) {
    logError("Error writing database", error);
    throw new Error("Database write error");
  }
}

async function compressImage(buffer: Buffer, imageName: string): Promise<Buffer> {
  logInfo("Compressing image", { imageName, bufferSize: buffer.length });
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error("Empty buffer provided to compressImage");
    }

    const image = sharp(buffer);
    logInfo("Created Sharp instance");

    const metadata = await image.metadata();
    logInfo("Image metadata retrieved", {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      size: buffer.length,
    });

    if (!metadata) {
      throw new Error("Failed to read image metadata");
    }

    // Always process the image for consistent output
    logInfo("Processing image with Sharp");
    const processedBuffer = await image
      .resize({
        width: Math.min(metadata.width || 1920, 1920),
        height: Math.min(metadata.height || 1080, 1080),
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    logInfo("Image compression complete", {
      originalSize: buffer.length,
      compressedSize: processedBuffer.length,
    });

    return processedBuffer;
  } catch (error) {
    logError("Error in compressImage", error);
    throw error;
  }
}

async function saveImage(file: File, type: "hero" | "carousel"): Promise<Image> {
  logInfo("Starting image save process", {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    imageType: type,
    environment: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL,
  });

  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    logInfo("File validation passed");

    // Read file data
    let arrayBuffer: ArrayBuffer;
    try {
      logInfo("Reading file to ArrayBuffer");
      arrayBuffer = await file.arrayBuffer();
      logInfo("ArrayBuffer created", { size: arrayBuffer.byteLength });
    } catch (error) {
      logError("Error reading file to ArrayBuffer", error);
      throw new Error("Failed to read file data");
    }

    // Convert to Buffer
    let buffer: Buffer;
    try {
      logInfo("Converting ArrayBuffer to Buffer");
      buffer = Buffer.from(arrayBuffer);
      logInfo("Buffer created", { size: buffer.length });
    } catch (error) {
      logError("Error creating Buffer from ArrayBuffer", error);
      throw new Error("Failed to create buffer from file data");
    }

    // Compress image
    logInfo("Starting image compression");
    const compressedBuffer = await compressImage(buffer, file.name);
    logInfo("Image compression completed", {
      originalSize: buffer.length,
      compressedSize: compressedBuffer.length,
    });

    // Upload to storage service
    logInfo("Starting upload to storage service", {
      fileName: file.name,
      bufferSize: compressedBuffer.length,
      storageEndpoint: process.env.DO_SPACES_ENDPOINT,
    });

    const filename = await StorageService.upload(compressedBuffer, file.name);
    logInfo("Upload to storage service completed", { filename });

    // Read current DB
    logInfo("Reading database for update");
    const db = await readDB();

    // Initialize arrays if they don't exist
    if (!db.hero) db.hero = [];
    if (!db.carousel) db.carousel = [];

    // Generate new ID (max existing ID + 1)
    const existingIds = [...db.hero.map((img) => img.id), ...db.carousel.map((img) => img.id)];
    const newId = existingIds.length > 0 ? Math.max(...existingIds, 0) + 1 : 1;
    logInfo("Generated new image ID", { newId });

    // Create new image
    const imageUrl = `${process.env.DO_SPACES_IMAGE_URL}/${filename}`;
    logInfo("Creating image URL", { imageUrl });

    const newImage: Image = {
      id: newId,
      url: imageUrl,
      alt: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for alt
      type: type,
    };

    // Convert to unknown first to satisfy TypeScript
    logInfo("Created new image object", newImage as unknown as Record<string, unknown>);

    // Add to DB in the correct array
    db[type].push(newImage);
    await writeDB(db);

    logInfo("Revalidating path");
    revalidatePath("/images");

    logInfo("Image save process completed successfully", { id: newId, type });
    return newImage;
  } catch (error) {
    logError("Error uploading image", error);
    throw error;
  }
}

export async function uploadImage(file: File, type: "hero" | "carousel"): Promise<Image> {
  logInfo("uploadImage function called", { fileName: file.name, type });
  try {
    const result = await saveImage(file, type);
    logInfo("uploadImage completed successfully");
    return result;
  } catch (error) {
    logError("uploadImage failed", error);
    throw error;
  }
}

export async function deleteImage(id: string): Promise<void> {
  try {
    logInfo("deleteImage function called", { id });
    const db = await readDB();
    const numId = parseInt(id);

    // Find image in both hero and carousel arrays
    const heroIndex = db.hero.findIndex((img) => img.id === numId);
    const carouselIndex = db.carousel.findIndex((img) => img.id === numId);

    // Check if trying to delete a hero image and if it would leave less than 2 images
    if (heroIndex !== -1 && db.hero.length <= 2) {
      throw new Error("Cannot delete hero image. Hero section must maintain at least 2 images.");
    }

    if (heroIndex !== -1) {
      // Delete file using StorageService
      await StorageService.delete(db.hero[heroIndex].url);
      // Remove from array
      db.hero.splice(heroIndex, 1);
    }

    if (carouselIndex !== -1) {
      // Delete file using StorageService
      await StorageService.delete(db.carousel[carouselIndex].url);
      // Remove from array
      db.carousel.splice(carouselIndex, 1);
    }

    await writeDB(db);
    revalidatePath("/images");
    logInfo("deleteImage completed successfully");
  } catch (error) {
    logError("Error deleting image", error);
    throw error;
  }
}

export async function updateImageAlt(id: string, alt: string): Promise<Image> {
  try {
    logInfo("updateImageAlt function called", { id, alt });
    const db = await readDB();
    const numId = parseInt(id);

    // Find and update image in both hero and carousel arrays
    const heroImage = db.hero.find((img) => img.id === numId);
    const carouselImage = db.carousel.find((img) => img.id === numId);

    if (heroImage) {
      heroImage.alt = alt;
    }

    if (carouselImage) {
      carouselImage.alt = alt;
    }

    await writeDB(db);
    revalidatePath("/images");
    logInfo("updateImageAlt completed successfully");

    // Return the updated image
    const updatedImage = heroImage || carouselImage;
    if (!updatedImage) {
      throw new Error(`Image with ID ${id} not found`);
    }

    return updatedImage;
  } catch (error) {
    logError("Error updating image alt", error);
    throw error;
  }
}

export async function updateImage(id: string, file: File): Promise<Image> {
  try {
    logInfo("updateImage function called", { id, fileName: file.name });
    const db = await readDB();
    const numId = parseInt(id);

    // Find image in both hero and carousel arrays
    const heroImage = db.hero.find((img) => img.id === numId);
    const carouselImage = db.carousel.find((img) => img.id === numId);

    if (!heroImage && !carouselImage) {
      throw new Error(`Image with ID ${id} not found`);
    }

    // Get the old URL
    const oldUrl = heroImage ? heroImage.url : carouselImage!.url;

    // Delete the old image
    await StorageService.delete(oldUrl);
    logInfo("Old image deleted");

    // Upload the new image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const compressedBuffer = await compressImage(buffer, file.name);
    const filename = await StorageService.upload(compressedBuffer, file.name);
    logInfo("New image uploaded");

    // Update the database entry
    const targetImage = heroImage || carouselImage!;
    targetImage.url = `${process.env.DO_SPACES_IMAGE_URL}/${filename}`;
    logInfo("Database entry updated");

    await writeDB(db);
    revalidatePath("/images");
    logInfo("updateImage completed successfully");
    return targetImage;
  } catch (error) {
    logError("Error updating image", error);
    throw error;
  }
}
