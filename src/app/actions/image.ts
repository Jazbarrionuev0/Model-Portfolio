"use server";

import { revalidatePath } from "next/cache";
import { Image } from "@/types/image";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { promises as fs } from "fs";

const DB_PATH = join(process.cwd(), "data", "db.json");
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

async function readDB() {
  const content = await readFile(DB_PATH, "utf-8");
  return JSON.parse(content);
}

async function writeDB(data: Image) {
  await writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

async function compressImage(buffer: Buffer, imageName: string): Promise<Buffer> {
  console.info("Compressing image:", imageName);
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error("Empty buffer provided to compressImage");
    }

    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata) {
      throw new Error("Failed to read image metadata");
    }

    // If image is too large, compress it
    if (buffer.length > 5 * 1024 * 1024) {
      // 5MB
      return image
        .resize({
          width: Math.min(metadata.width || 1920, 1920),
          height: Math.min(metadata.height || 1080, 1080),
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    return buffer;
  } catch (error) {
    console.error("Error in compressImage:", error);
    throw error;
  }
}

async function saveImage(file: File, type: "hero" | "carousel"): Promise<Image> {
  try {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Create FormData and append file
    const formData = new FormData();
    formData.append("file", file);

    // Read file data using FormData
    const fileData = formData.get("file") as File;
    if (!fileData || fileData.size === 0) {
      throw new Error("File data is empty");
    }

    // Read file data more carefully
    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await fileData.arrayBuffer();
    } catch (error) {
      console.error("Error reading file to ArrayBuffer:", error);
      throw new Error("Failed to read file data");
    }

    // Convert to Buffer with error handling
    let buffer: Buffer;
    try {
      buffer = Buffer.from(arrayBuffer);
    } catch (error) {
      console.error("Error creating Buffer from ArrayBuffer:", error);
      throw new Error("Failed to create buffer from file data");
    }

    if (!buffer || buffer.length === 0) {
      throw new Error("Created buffer is empty");
    }

    const uploadsDir = join(process.cwd(), "public/uploads");

    // Check if the uploads directory exists, if not, create it
    try {
      await fs.access(uploadsDir);
    } catch (error) {
      console.error("Error accessing uploads directory:", error);
      // Directory does not exist, create it
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
    const path = join(uploadsDir, filename);

    // Compress and save image
    const compressedBuffer = await compressImage(buffer, filename);

    if (!compressedBuffer || compressedBuffer.length === 0) {
      throw new Error("Failed to compress image");
    }

    await writeFile(path, compressedBuffer);

    // Read current DB
    const db = await readDB();

    // Generate new ID (max existing ID + 1)
    const existingIds = db[type].map((img: Image) => img.id);
    const newId = Math.max(...existingIds, 0) + 1;

    // Create new image
    const newImage: Image = {
      id: newId,
      // url: `/uploads/${filename}`,
      url: `/api/images/${filename}`,
      alt: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension from alt text
      type: type,
    };

    // Add to DB
    db[type].push(newImage);
    await writeDB(db);

    revalidatePath("/images");
    return newImage;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function uploadImage(file: File, type: "hero" | "carousel"): Promise<Image> {
  return await saveImage(file, type);
}

export async function deleteImage(id: string): Promise<void> {
  try {
    const db = await readDB();
    const numId = parseInt(id);

    // Find image in both hero and carousel arrays
    const heroIndex = db.hero.findIndex((img: Image) => img.id === numId);
    const carouselIndex = db.carousel.findIndex((img: Image) => img.id === numId);

    // Check if trying to delete a hero image and if it would leave less than 2 images
    if (heroIndex !== -1 && db.hero.length <= 2) {
      throw new Error("Cannot delete hero image. Hero section must maintain at least 2 images.");
    }

    if (heroIndex !== -1) {
      // Delete file from public/uploads directory
      const path = join(process.cwd(), "public", db.hero[heroIndex].url);
      await writeFile(path, "").catch(() => {}); // Ignore errors if file doesn't exist

      // Remove from array
      db.hero.splice(heroIndex, 1);
    }

    if (carouselIndex !== -1) {
      // Delete file from public/uploads directory
      const path = join(process.cwd(), "public", db.carousel[carouselIndex].url);
      await writeFile(path, "").catch(() => {}); // Ignore errors if file doesn't exist

      // Remove from array
      db.carousel.splice(carouselIndex, 1);
    }

    await writeDB(db);
    revalidatePath("/images");
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

export async function updateImageAlt(id: string, alt: string): Promise<Image> {
  try {
    const db = await readDB();
    const numId = parseInt(id);

    // Find and update image in both hero and carousel arrays
    const heroImage = db.hero.find((img: Image) => img.id === numId);
    const carouselImage = db.carousel.find((img: Image) => img.id === numId);

    if (heroImage) {
      heroImage.alt = alt;
    }

    if (carouselImage) {
      carouselImage.alt = alt;
    }

    await writeDB(db);
    revalidatePath("/images");

    return heroImage || carouselImage;
  } catch (error) {
    console.error("Error updating image:", error);
    throw error;
  }
}
