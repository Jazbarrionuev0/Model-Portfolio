"use server";

import { getCampaigns, addCampaign, deleteCampaign, updateCampaign, getCampaign } from "@/db/database";
import { Campaign } from "@/types/campaign";

export async function getCampaignsAction() {
  return await getCampaigns();
}

export async function getCampaignAction(id: number) {
  const campaign = await getCampaign(id);
  return campaign;
}

export async function addCampaignAction(campaign: Omit<Campaign, "id">) {
  return await addCampaign(campaign);
}

export async function updateCampaignAction(campaign: Campaign) {
  return await updateCampaign(campaign);
}

export async function deleteCampaignAction(id: number) {
  return await deleteCampaign(id);
}
