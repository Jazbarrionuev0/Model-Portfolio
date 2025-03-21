"use server";

import { getCarouselImages, addCarouselImage, deleteCarouselImage } from "@/db/database";
import { Image } from "@/types/image";

export async function getCarouselImagesAction() {
  return await getCarouselImages();
}

export async function addCarouselImageAction(image: Image) {
  return await addCarouselImage(image);
}

export async function deleteCarouselImageAction(id: number) {
  return await deleteCarouselImage(id);
}
