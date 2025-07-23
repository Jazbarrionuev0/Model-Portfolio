"use server";

import { addCarouselImage, deleteCarouselImage, getCarouselImages } from "@/lib/database";
import { Image } from "@/types/image";
import { revalidatePath } from "next/cache";

export async function getCarouselImagesAction() {
  return await getCarouselImages();
}

export async function addCarouselImageAction(image: Image) {
  const result = await addCarouselImage(image);
  revalidatePath("/");
  revalidatePath("/(admin)");
  revalidatePath("/(admin)/images");
  return result;
}

export async function deleteCarouselImageAction(id: number) {
  const result = await deleteCarouselImage(id);
  revalidatePath("/");
  revalidatePath("/(admin)");
  revalidatePath("/(admin)/images");
  return result;
}
