"use server";

import { addCampaign, deleteCampaign, getCampaign, getCampaigns, updateCampaign } from "@/lib/database";
import { Campaign } from "@/types/campaign";
import { revalidatePath } from "next/cache";
import { logCacheInfo, logRevalidation } from "@/lib/cache-debug";
import { logger } from "@/lib/logger";

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
    logger.info("Starting campaign creation", "CAMPAIGN", { campaignData: { brand: campaign.brand.name, description: campaign.description.substring(0, 50) + "..." } });
    
    const result = await addCampaign(campaign);
    const pathsToRevalidate = ["/", "/(admin)", "/(admin)/campaigns"];
    logRevalidation(pathsToRevalidate);
    revalidatePath("/");
    revalidatePath("/(admin)");
    revalidatePath("/(admin)/campaigns");
    logCacheInfo("addCampaignAction", result);
    
    logger.info("Campaign created successfully", "CAMPAIGN", { campaignId: result.id, campaignName: result.brand.name });
    
    return result;
  } catch (error) {
    logger.error("Campaign creation failed", "CAMPAIGN", error instanceof Error ? error : new Error(String(error)), { 
      campaignData: { 
        brandName: campaign.brand.name, 
        description: campaign.description.substring(0, 50) + "...",
        hasLogo: !!campaign.brand.logo?.url,
        hasMainImage: !!campaign.image?.url,
        additionalImages: campaign.images?.length || 0
      }
    });
    console.error("Error adding campaign:", error);
    throw error; // Re-throw to propagate to client
  }
}

export async function updateCampaignAction(campaign: Campaign) {
  try {
    logger.info("Starting campaign update", "CAMPAIGN", { campaignId: campaign.id, campaignName: campaign.brand.name });
    
    const result = await updateCampaign(campaign);
    revalidatePath("/");
    revalidatePath("/(admin)");
    revalidatePath("/(admin)/campaigns");
    revalidatePath(`/campaign/${campaign.id}`);
    
    logger.info("Campaign updated successfully", "CAMPAIGN", { campaignId: campaign.id, campaignName: campaign.brand.name });
    
    return result;
  } catch (error) {
    logger.error("Campaign update failed", "CAMPAIGN", error instanceof Error ? error : new Error(String(error)), { 
      campaignId: campaign.id,
      campaignName: campaign.brand.name
    });
    console.error("Error updating campaign:", error);
    throw error;
  }
}

export async function deleteCampaignAction(id: number) {
  try {
    logger.info("Starting campaign deletion", "CAMPAIGN", { campaignId: id });
    
    const result = await deleteCampaign(id);
    revalidatePath("/");
    revalidatePath("/(admin)");
    revalidatePath("/(admin)/campaigns");
    
    logger.info("Campaign deleted successfully", "CAMPAIGN", { campaignId: id });
    
    return result;
  } catch (error) {
    logger.error("Campaign deletion failed", "CAMPAIGN", error instanceof Error ? error : new Error(String(error)), { 
      campaignId: id
    });
    console.error("Error deleting campaign:", error);
    throw error;
  }
}
