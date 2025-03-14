import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { Image } from "@/types/image";

interface DatabaseSchema {
  hero: Image[];
}

const file = join(process.cwd(), "data", "db.json");
const adapter = new JSONFile<DatabaseSchema>(file);
const defaultData: DatabaseSchema = { hero: [] };
const db = new Low<DatabaseSchema>(adapter, defaultData);

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

export const updateHeroImage = async (id: number, image: Partial<Image>) => {
  await db.read();
  const index = db.data.hero.findIndex((img) => img.id === id);
  if (index === -1) throw new Error("Image not found");

  db.data.hero[index] = { ...db.data.hero[index], ...image };
  await db.write();
  return db.data.hero[index];
};

export const deleteHeroImage = async (id: number) => {
  await db.read();
  const index = db.data.hero.findIndex((img) => img.id === id);
  if (index === -1) throw new Error("Image not found");

  db.data.hero.splice(index, 1);
  await db.write();
};
