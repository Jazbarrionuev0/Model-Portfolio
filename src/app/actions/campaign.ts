"use server";

import { revalidatePath } from "next/cache";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { Campaign } from "@/types/campaign";
import { Image } from "@/types/image";

const DB_PATH = join(process.cwd(), "data", "db.json");

async function readDB() {
  const content = await readFile(DB_PATH, "utf-8");
  return JSON.parse(content);
}

async function writeDB(data: Image) {
  await writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const db = await readDB();
    return db.campaigns || [];
  } catch (error) {
    console.error("Error reading campaigns:", error);
    throw error;
  }
}

export async function createCampaign(campaign: Omit<Campaign, "id">): Promise<Campaign> {
  try {
    const db = await readDB();

    // Generate new ID (max existing ID + 1)
    const existingIds = (db.campaigns || []).map((c: Campaign) => c.id);
    const newId = Math.max(...existingIds, 0) + 1;

    const newCampaign: Campaign = {
      ...campaign,
      id: newId.toString(),
    };

    // Initialize campaigns array if it doesn't exist
    if (!db.campaigns) {
      db.campaigns = [];
    }

    db.campaigns.push(newCampaign);
    await writeDB(db);

    revalidatePath("/campaigns");
    return newCampaign;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
}

export async function updateCampaign(id: string, campaign: Omit<Campaign, "id">): Promise<Campaign> {
  try {
    const db = await readDB();
    const numId = parseInt(id);

    const index = db.campaigns.findIndex((c: Campaign) => c.id === numId.toString());
    if (index === -1) {
      throw new Error("Campaign not found");
    }

    const updatedCampaign: Campaign = {
      ...campaign,
      id: numId.toString(),
    };

    db.campaigns[index] = updatedCampaign;
    await writeDB(db);

    revalidatePath("/campaigns");
    return updatedCampaign;
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }
}

export async function deleteCampaign(id: string): Promise<void> {
  try {
    const db = await readDB();
    const numId = parseInt(id);

    const index = db.campaigns.findIndex((c: Campaign) => c.id === numId.toString());
    if (index === -1) {
      throw new Error("Campaign not found");
    }

    db.campaigns.splice(index, 1);
    await writeDB(db);

    revalidatePath("/campaigns");
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
}
