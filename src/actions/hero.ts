"use server";

import { getHeroImages, addHeroImage, deleteHeroImage } from "@/db/database";
import { Image } from "@/types/image";
import { revalidatePath } from "next/cache";
import { tryCatch } from "@/lib/try-catch";

export async function getHeroImagesAction() {
  const { data, error } = await tryCatch(getHeroImages());

  if (error) {
    console.error("Error fetching hero images:", error);
    return [];
  }

  return data;
}

export async function addHeroImageAction(image: Image) {
  const { data, error } = await tryCatch(addHeroImage(image));
  if (error) {
    console.error("Error adding hero image:", error);
    return undefined;
  }
  revalidatePath("/");
  revalidatePath("/images");
  return data;
}

export async function deleteHeroImageAction(id: number) {
  const { data, error } = await tryCatch(deleteHeroImage(id));
  if (error) {
    console.error("Error deleting hero image:", error);
    return undefined;
  }
  revalidatePath("/");
  revalidatePath("/images");

  return data;
}
