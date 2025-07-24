"use server";

import { Image } from "@/types/image";
import { revalidatePath } from "next/cache";
import { tryCatch } from "@/lib/try-catch";
import { addHeroImage, deleteHeroImage, getHeroImages } from "@/lib/database";
import { logger } from "@/lib/logger";

export async function getHeroImagesAction() {
  try {
    logger.info("Fetching hero images", "HERO_IMAGES");
    const { data, error } = await tryCatch(getHeroImages());

    if (error) {
      logger.error("Failed to fetch hero images", "HERO_IMAGES", error instanceof Error ? error : new Error(String(error)));
      console.error("Error fetching hero images:", error);
      return [];
    }

    logger.info("Hero images fetched successfully", "HERO_IMAGES", { imageCount: data?.length || 0 });
    return data;
  } catch (error) {
    logger.error("Unexpected error in getHeroImagesAction", "HERO_IMAGES", error instanceof Error ? error : new Error(String(error)));
    console.error("Error fetching hero images:", error);
    return [];
  }
}

export async function addHeroImageAction(image: Image) {
  try {
    logger.info("Starting hero image addition", "HERO_IMAGES", {
      imageId: image.id,
      imageUrl: image.url?.substring(0, 50) + "...",
      alt: image.alt,
    });

    const result = await tryCatch(
      (async () => {
        const data = await addHeroImage(image);
        revalidatePath("/");
        revalidatePath("/(admin)");
        revalidatePath("/(admin)/images");
        return data;
      })()
    );

    if (result.error) {
      logger.error("Failed to add hero image", "HERO_IMAGES", result.error instanceof Error ? result.error : new Error(String(result.error)), {
        imageId: image.id,
        imageUrl: image.url?.substring(0, 50) + "...",
        alt: image.alt,
      });
      return result;
    }

    logger.info("Hero image added successfully", "HERO_IMAGES", {
      imageId: image.id,
      resultId: result.data?.id,
    });

    return result;
  } catch (error) {
    logger.error("Unexpected error in addHeroImageAction", "HERO_IMAGES", error instanceof Error ? error : new Error(String(error)), {
      imageId: image.id,
      imageUrl: image.url?.substring(0, 50) + "...",
      alt: image.alt,
    });
    throw error;
  }
}

export async function deleteHeroImageAction(id: number) {
  try {
    logger.info("Starting hero image deletion", "HERO_IMAGES", { imageId: id });

    const { data, error } = await tryCatch(deleteHeroImage(id));

    if (error) {
      logger.error("Failed to delete hero image", "HERO_IMAGES", error instanceof Error ? error : new Error(String(error)), {
        imageId: id,
      });
      console.error("Error deleting hero image:", error);
      return undefined;
    }

    revalidatePath("/");
    revalidatePath("/(admin)");
    revalidatePath("/(admin)/images");

    logger.info("Hero image deleted successfully", "HERO_IMAGES", { imageId: id });

    return data;
  } catch (error) {
    logger.error("Unexpected error in deleteHeroImageAction", "HERO_IMAGES", error instanceof Error ? error : new Error(String(error)), {
      imageId: id,
    });
    console.error("Error deleting hero image:", error);
    return undefined;
  }
}
