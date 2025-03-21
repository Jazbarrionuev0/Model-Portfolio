import { createClient } from "redis";
import { Image } from "@/types/image";
import { Campaign } from "@/types/campaign";
import { deleteImageAction } from "@/actions/delete";

const redis = createClient({ url: process.env.REDIS_URL! });
redis.connect().catch(console.error);

export const getHeroImages = async (): Promise<Image[]> => {
  const data = await redis.get("hero");
  return data ? JSON.parse(data) : [];
};

export const addHeroImage = async (image: Image): Promise<Image> => {
  const images = await getHeroImages();
  const newImage = {
    ...image,
    id: image.id || Date.now(),
  };
  images.push(newImage);
  await redis.set("hero", JSON.stringify(images));
  return newImage;
};

export const deleteHeroImage = async (id: number): Promise<void> => {
  const images = await getHeroImages();
  const index = images.findIndex((img) => img.id === id);
  if (index === -1) throw new Error("Image not found");

  const imageToDelete = images[index];
  images.splice(index, 1);

  await deleteImageAction(imageToDelete.url);
  await redis.set("hero", JSON.stringify(images));
};

export const getCarouselImages = async (): Promise<Image[]> => {
  const data = await redis.get("carousel");
  return data ? JSON.parse(data) : [];
};

export const addCarouselImage = async (image: Image): Promise<Image> => {
  const images = await getCarouselImages();
  const newImage = {
    ...image,
    id: image.id || Date.now(),
  };
  images.push(newImage);
  await redis.set("carousel", JSON.stringify(images));
  return newImage;
};

export const deleteCarouselImage = async (id: number): Promise<void> => {
  const images = await getCarouselImages();
  const index = images.findIndex((img) => img.id === id);
  if (index === -1) throw new Error("Image not found");

  const imageToDelete = images[index];

  images.splice(index, 1);

  await deleteImageAction(imageToDelete.url);
  await redis.set("carousel", JSON.stringify(images));
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  const data = await redis.get("campaigns");
  return data ? JSON.parse(data) : [];
};

export const getCampaign = async (id: number): Promise<Campaign> => {
  const campaigns = await getCampaigns();
  const campaign = campaigns.find((campaign) => campaign.id === id);
  if (!campaign) throw new Error("Campaign not found");
  return campaign;
};

export const addCampaign = async (campaign: Omit<Campaign, "id">): Promise<Campaign> => {
  const campaigns = await getCampaigns();
  const newCampaign = {
    ...campaign,
    id: Date.now(),
  };
  campaigns.push(newCampaign);
  await redis.set("campaigns", JSON.stringify(campaigns));
  return newCampaign;
};

export const updateCampaign = async (campaign: Campaign): Promise<void> => {
  const campaigns = await getCampaigns();
  const index = campaigns.findIndex((c) => c.id === campaign.id);
  if (index === -1) throw new Error("Campaign not found");
  campaigns[index] = campaign;
  await redis.set("campaigns", JSON.stringify(campaigns));
};

export const deleteCampaign = async (id: number): Promise<void> => {
  const campaigns = await getCampaigns();
  const index = campaigns.findIndex((campaign) => campaign.id === id);
  if (index === -1) throw new Error("Campaign not found");

  const campaign = campaigns[index];
  campaigns.splice(index, 1);

  await deleteImageAction(campaign.image.url);
  for (const image of campaign.images) {
    await deleteImageAction(image.url);
  }
  await redis.set("campaigns", JSON.stringify(campaigns));
};
