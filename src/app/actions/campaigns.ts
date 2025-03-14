"use server";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { Campaign } from "@/types/campaign";
import { revalidatePath } from "next/cache";

interface DatabaseSchema {
  campaigns: Campaign[];
}

const file = join(process.cwd(), "data", "db.json");
const adapter = new JSONFile<DatabaseSchema>(file);
const defaultData: DatabaseSchema = { campaigns: [] };
const db = new Low<DatabaseSchema>(adapter, defaultData);

export async function getCampaigns() {
  await db.read();
  return db.data.campaigns;
}

export async function getCampaign(id: string) {
  await db.read();
  const campaign = db.data.campaigns.find((c) => c.id === id);
  if (!campaign) throw new Error("Campaign not found");
  return campaign;
}

export async function createCampaign(campaign: Omit<Campaign, "id">) {
  "use server";
  try {
    await db.read();
    const newCampaign = {
      ...campaign,
      id: Date.now().toString(),
    };
    db.data.campaigns.push(newCampaign);
    await db.write();
    revalidatePath("/campaigns");
    return newCampaign;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
}

export async function updateCampaign(id: string, campaign: Partial<Campaign>) {
  "use server";
  await db.read();
  const index = db.data.campaigns.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Campaign not found");

  db.data.campaigns[index] = { ...db.data.campaigns[index], ...campaign };
  await db.write();
  revalidatePath("/campaigns");
  return db.data.campaigns[index];
}

export async function deleteCampaign(id: string) {
  "use server";
  await db.read();
  const index = db.data.campaigns.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Campaign not found");

  db.data.campaigns.splice(index, 1);
  await db.write();
  revalidatePath("/campaigns");
  return { success: true };
}
