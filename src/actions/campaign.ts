"use server";

import { addCampaign, deleteCampaign, getCampaign, getCampaigns, updateCampaign } from "@/lib/database";
import { Campaign } from "@/types/campaign";
import { revalidatePath } from "next/cache";
import { logCacheInfo, logRevalidation } from "@/lib/cache-debug";

export async function getCampaignsAction() {
  const campaigns = await getCampaigns();
  logCacheInfo("getCampaignsAction", campaigns);
  return campaigns;
}

export async function getCampaignAction(id: number) {
  const campaign = await getCampaign(id);
  return campaign;
}

export async function addCampaignAction(campaign: Omit<Campaign, "id">) {
  try {
    const result = await addCampaign(campaign);
    const pathsToRevalidate = ["/", "/(admin)", "/(admin)/campaigns"];
    logRevalidation(pathsToRevalidate);
    revalidatePath("/");
    revalidatePath("/(admin)");
    revalidatePath("/(admin)/campaigns");
    logCacheInfo("addCampaignAction", result);
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
    revalidatePath("/(admin)");
    revalidatePath("/(admin)/campaigns");
    revalidatePath(`/campaign/${campaign.id}`);
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
    revalidatePath("/(admin)");
    revalidatePath("/(admin)/campaigns");
    return result;
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
}
