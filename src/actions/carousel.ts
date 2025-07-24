"use server";

import { addCarouselImage, deleteCarouselImage, getCarouselImages } from "@/lib/database";
import { Image } from "@/types/image";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

export async function getCarouselImagesAction() {
  try {
    const result = await getCarouselImages();
    return result;
  } catch (error) {
    console.error("Failed to fetch carousel images:", error);
    throw error;
  }
}

export async function addCarouselImageAction(image: Image) {
  try {
    logger.info("Starting carousel image addition", "CAROUSEL_IMAGES", {
      imageId: image.id,
      imageUrl: image.url?.substring(0, 50) + "...",
      alt: image.alt,
    });

    const result = await addCarouselImage(image);
    revalidatePath("/");
    revalidatePath("/(admin)");
    revalidatePath("/(admin)/images");

    logger.info("Carousel image added successfully", "CAROUSEL_IMAGES", {
      imageId: image.id,
      resultId: result?.id,
    });

    return result;
  } catch (error) {
    logger.error("Failed to add carousel image", "CAROUSEL_IMAGES", error instanceof Error ? error : new Error(String(error)), {
      imageId: image.id,
      imageUrl: image.url?.substring(0, 50) + "...",
      alt: image.alt,
    });
    throw error;
  }
}

export async function deleteCarouselImageAction(id: number) {
  try {
    logger.info("Starting carousel image deletion", "CAROUSEL_IMAGES", { imageId: id });

    const result = await deleteCarouselImage(id);
    revalidatePath("/");
    revalidatePath("/(admin)");
    revalidatePath("/(admin)/images");

    logger.info("Carousel image deleted successfully", "CAROUSEL_IMAGES", { imageId: id });

    return result;
  } catch (error) {
    logger.error("Failed to delete carousel image", "CAROUSEL_IMAGES", error instanceof Error ? error : new Error(String(error)), {
      imageId: id,
    });
    throw error;
  }
}
