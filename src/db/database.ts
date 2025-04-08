import { createClient } from "redis";
import { Image } from "@/types/image";
import { Campaign } from "@/types/campaign";
import { deleteImageAction } from "@/actions/delete";
import { Profile } from "@/types/profile";
import { logError, logInfo } from "@/lib/utils";

const redis = createClient({ url: process.env.REDIS_URL! });
redis.connect().catch((err) => logError("Redis connection error", err));

export const getHeroImages = async (): Promise<Image[]> => {
  try {
    logInfo("Fetching hero images");
    const data = await redis.get("hero");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logError("Error fetching hero images", error);
    throw error;
  }
};

export const addHeroImage = async (image: Image): Promise<Image> => {
  try {
    logInfo("Adding hero image", { imageId: image.id });
    const images = await getHeroImages();
    const newImage = {
      ...image,
      id: image.id || Date.now(),
    };
    images.push(newImage);
    await redis.set("hero", JSON.stringify(images));
    logInfo("Hero image added successfully", { imageId: newImage.id });
    return newImage;
  } catch (error) {
    logError("Error adding hero image", error);
    throw error;
  }
};

export const deleteHeroImage = async (id: number): Promise<void> => {
  try {
    logInfo("Deleting hero image", { imageId: id });
    const images = await getHeroImages();
    const index = images.findIndex((img) => img.id === id);
    if (index === -1) {
      const error = new Error("Image not found");
      logError("Hero image not found", { imageId: id, error });
      throw error;
    }

    const imageToDelete = images[index];
    images.splice(index, 1);

    await deleteImageAction(imageToDelete.url);
    await redis.set("hero", JSON.stringify(images));
    logInfo("Hero image deleted successfully", { imageId: id });
  } catch (error) {
    logError("Error deleting hero image", error);
    throw error;
  }
};

export const getCarouselImages = async (): Promise<Image[]> => {
  try {
    logInfo("Fetching carousel images");
    const data = await redis.get("carousel");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logError("Error fetching carousel images", error);
    throw error;
  }
};

export const addCarouselImage = async (image: Image): Promise<Image> => {
  try {
    logInfo("Adding carousel image", { imageId: image.id });
    const images = await getCarouselImages();
    const newImage = {
      ...image,
      id: image.id || Date.now(),
    };
    images.push(newImage);
    await redis.set("carousel", JSON.stringify(images));
    logInfo("Carousel image added successfully", { imageId: newImage.id });
    return newImage;
  } catch (error) {
    logError("Error adding carousel image", error);
    throw error;
  }
};

export const deleteCarouselImage = async (id: number): Promise<void> => {
  try {
    logInfo("Deleting carousel image", { imageId: id });
    const images = await getCarouselImages();
    const index = images.findIndex((img) => img.id === id);
    if (index === -1) {
      const error = new Error("Image not found");
      logError("Carousel image not found", { imageId: id, error });
      throw error;
    }

    const imageToDelete = images[index];
    images.splice(index, 1);

    await deleteImageAction(imageToDelete.url);
    await redis.set("carousel", JSON.stringify(images));
    logInfo("Carousel image deleted successfully", { imageId: id });
  } catch (error) {
    logError("Error deleting carousel image", error);
    throw error;
  }
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    logInfo("Fetching campaigns");
    const data = await redis.get("campaigns");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logError("Error fetching campaigns", error);
    throw error;
  }
};

export const getCampaign = async (id: number): Promise<Campaign> => {
  try {
    logInfo("Fetching campaign", { campaignId: id });
    const campaigns = await getCampaigns();
    const campaign = campaigns.find((campaign) => campaign.id === id);
    if (!campaign) {
      const error = new Error("Campaign not found");
      logError("Campaign not found", { campaignId: id, error });
      throw error;
    }
    return campaign;
  } catch (error) {
    logError("Error fetching campaign", error);
    throw error;
  }
};

export const addCampaign = async (campaign: Omit<Campaign, "id">): Promise<Campaign> => {
  try {
    logInfo("Adding campaign", { campaign });
    const campaigns = await getCampaigns();
    const newCampaign = {
      ...campaign,
      id: Date.now(),
    };
    campaigns.push(newCampaign);
    await redis.set("campaigns", JSON.stringify(campaigns));
    logInfo("Campaign added successfully", { campaignId: newCampaign.id });
    return newCampaign;
  } catch (error) {
    logError("Error adding campaign", error);
    throw error;
  }
};

export const updateCampaign = async (campaign: Campaign): Promise<void> => {
  try {
    logInfo("Updating campaign", { campaignId: campaign.id });
    const campaigns = await getCampaigns();
    const index = campaigns.findIndex((c) => c.id === campaign.id);
    if (index === -1) {
      const error = new Error("Campaign not found");
      logError("Campaign not found for update", { campaignId: campaign.id, error });
      throw error;
    }
    campaigns[index] = campaign;
    await redis.set("campaigns", JSON.stringify(campaigns));
    logInfo("Campaign updated successfully", { campaignId: campaign.id });
  } catch (error) {
    logError("Error updating campaign", error);
    throw error;
  }
};

export const deleteCampaign = async (id: number): Promise<void> => {
  try {
    logInfo("Deleting campaign", { campaignId: id });
    const campaigns = await getCampaigns();
    const index = campaigns.findIndex((campaign) => campaign.id === id);
    if (index === -1) {
      const error = new Error("Campaign not found");
      logError("Campaign not found for deletion", { campaignId: id, error });
      throw error;
    }

    const campaign = campaigns[index];
    campaigns.splice(index, 1);

    await deleteImageAction(campaign.image.url);
    for (const image of campaign.images) {
      await deleteImageAction(image.url);
    }
    await redis.set("campaigns", JSON.stringify(campaigns));
    logInfo("Campaign deleted successfully", { campaignId: id });
  } catch (error) {
    logError("Error deleting campaign", error);
    throw error;
  }
};

export const getProfile = async (): Promise<Profile> => {
  try {
    logInfo("Fetching profile");
    const data = await redis.get("profile");
    return JSON.parse(data!);
  } catch (error) {
    logError("Error fetching profile", error);
    throw error;
  }
};

export const createProfile = async (profile: Profile): Promise<Profile> => {
  try {
    logInfo("Creating profile");
    await redis.set("profile", JSON.stringify(profile));
    logInfo("Profile created successfully");
    return profile;
  } catch (error) {
    logError("Error creating profile", error);
    throw error;
  }
};

export const updateProfile = async (profile: Profile): Promise<Profile> => {
  try {
    logInfo("Updating profile");
    await redis.set("profile", JSON.stringify(profile));
    logInfo("Profile updated successfully");
    return profile;
  } catch (error) {
    logError("Error updating profile", error);
    throw error;
  }
};
