import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { Image } from "@/types/image";
import { Database } from "@/types/database";
import { Campaign } from "@/types/campaign";

const file = join(process.cwd(), "data", "db.json");
const adapter = new JSONFile<Database>(file);
const defaultData: Database = {
  hero: [],
  carousel: [],
  campaigns: [],
};
const db = new Low<Database>(adapter, defaultData);

export const getHeroImages = async () => {
  await db.read();
  return db.data.hero;
};

export const addHeroImage = async (image: Omit<Image, "id">) => {
  await db.read();
  const newImage = {
    ...image,
    id: Date.now(),
  };
  db.data.hero.push(newImage);
  await db.write();
  return newImage;
};

export const deleteHeroImage = async (id: number) => {
  await db.read();
  const index = db.data.hero.findIndex((img) => img.id === id);
  if (index === -1) throw new Error("Image not found");

  db.data.hero.splice(index, 1);
  await db.write();
};

export const getCarouselImages = async () => {
  await db.read();
  return db.data.carousel;
};

export const addCarouselImage = async (image: Omit<Image, "id">) => {
  await db.read();
  const newImage = {
    ...image,
    id: Date.now(),
  };
  db.data.carousel.push(newImage);
  await db.write();
  return newImage;
};

export const deleteCarouselImage = async (id: number) => {
  await db.read();
  const index = db.data.carousel.findIndex((img) => img.id === id);
  if (index === -1) throw new Error("Image not found");
  db.data.carousel.splice(index, 1);
  await db.write();
};

export const getCampaigns = async () => {
  await db.read();
  return db.data.campaigns;
};

export const getCampaign = async (id: number) => {
  await db.read();
  return db.data.campaigns.find((campaign) => campaign.id === id);
};

export const addCampaign = async (campaign: Omit<Campaign, "id">) => {
  await db.read();
  const newCampaign = {
    ...campaign,
    id: Date.now(),
  };
  db.data.campaigns.push(newCampaign);
  await db.write();
  return newCampaign;
};

export const updateCampaign = async (campaign: Campaign) => {
  await db.read();
  const index = db.data.campaigns.findIndex((campaign) => campaign.id === campaign.id);
  if (index === -1) throw new Error("Campaign not found");
  db.data.campaigns[index] = campaign;
  await db.write();
};

export const deleteCampaign = async (id: number) => {
  await db.read();
  const index = db.data.campaigns.findIndex((campaign) => campaign.id === id);
  if (index === -1) throw new Error("Campaign not found");
  db.data.campaigns.splice(index, 1);
  await db.write();
};
