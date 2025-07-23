"use server";

import { Image } from "@/types/image";
import { revalidatePath } from "next/cache";
import { tryCatch } from "@/lib/try-catch";
import { addHeroImage, deleteHeroImage, getHeroImages } from "@/lib/database";

export async function getHeroImagesAction() {
  const { data, error } = await tryCatch(getHeroImages());

  if (error) {
    console.error("Error fetching hero images:", error);
    return [];
  }

  return data;
}

export async function addHeroImageAction(image: Image) {
  const result = await tryCatch(
    (async () => {
      const data = await addHeroImage(image);
      revalidatePath("/");
      revalidatePath("/(admin)");
      revalidatePath("/(admin)/images");
      return data;
    })()
  );
  return result;
}

export async function deleteHeroImageAction(id: number) {
  const { data, error } = await tryCatch(deleteHeroImage(id));
  if (error) {
    console.error("Error deleting hero image:", error);
    return undefined;
  }
  revalidatePath("/");
  revalidatePath("/(admin)");
  revalidatePath("/(admin)/images");

  return data;
}
