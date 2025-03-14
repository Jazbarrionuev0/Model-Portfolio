"use server";

import { getHeroImages, addHeroImage, updateHeroImage, deleteHeroImage } from "@/db/database";
import { Image } from "@/types/image";
export async function getHeroImagesAction() {
  return await getHeroImages();
}

export async function addHeroImageAction(image: Image) {
  return await addHeroImage(image);
}

export async function updateHeroImageAction(id: number, image: Image) {
  return await updateHeroImage(id, image);
}

export async function deleteHeroImageAction(id: number) {
  return await deleteHeroImage(id);
}
