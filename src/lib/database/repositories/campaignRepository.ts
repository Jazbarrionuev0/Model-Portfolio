import { Campaign } from "@/types/campaign";
import { BaseRepository } from "./baseRepository";
import { deleteImageAction } from "@/actions/delete";
import { logInfo } from "@/lib/utils";

export class CampaignRepository extends BaseRepository<Campaign> {
  constructor() {
    super("campaigns");
  }

  async getCampaigns(): Promise<Campaign[]> {
    return this.getAll();
  }

  async getCampaign(id: number): Promise<Campaign> {
    return this.getById(id);
  }

  async addCampaign(campaign: Omit<Campaign, "id">): Promise<Campaign> {
    logInfo("Adding campaign", { campaign });
    const newCampaign = await this.add(campaign);
    logInfo("Campaign added successfully", { campaignId: newCampaign.id });
    return newCampaign;
  }

  async updateCampaign(campaign: Campaign): Promise<void> {
    logInfo("Updating campaign", { campaignId: campaign.id });
    await this.update(campaign);
    logInfo("Campaign updated successfully", { campaignId: campaign.id });
  }

  async deleteCampaign(id: number): Promise<void> {
    logInfo("Deleting campaign", { campaignId: id });
    const campaign = await this.getById(id);

    // Delete associated images
    await deleteImageAction(campaign.image.url);
    for (const image of campaign.images) {
      await deleteImageAction(image.url);
    }

    await this.delete(id);
    logInfo("Campaign deleted successfully", { campaignId: id });
  }
}
