"use server";

import { getCampaigns, addCampaign, deleteCampaign, updateCampaign, getCampaign } from "@/db/database";
import { Campaign } from "@/types/campaign";
import { revalidatePath } from "next/cache";

export async function getCampaignsAction() {
  return await getCampaigns();
}

export async function getCampaignAction(id: number) {
  const campaign = await getCampaign(id);
  return campaign;
}

export async function addCampaignAction(campaign: Omit<Campaign, "id">) {
  try {
    const result = await addCampaign(campaign);
    revalidatePath("/");
  revalidatePath("/campaigns");
    return result;
  } catch (error) {
    console.error("Error adding campaign:", error);
    throw error; // Re-throw to propagate to client
  }
}

export async function updateCampaignAction(campaign: Campaign) {
  try {
    const result = await updateCampaign(campaign);
    revalidatePath("/");
  revalidatePath("/campaigns");
    return result;
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }
}

export async function deleteCampaignAction(id: number) {
  try {
    const result = await deleteCampaign(id);
    revalidatePath("/");
  revalidatePath("/campaigns");
    return result;
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
}
