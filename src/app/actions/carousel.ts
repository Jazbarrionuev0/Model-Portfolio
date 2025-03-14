"use server";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { Image } from "@/types/image";

interface DatabaseSchema {
  carousel: Image[];
}

const file = join(process.cwd(), "data", "db.json");
const adapter = new JSONFile<DatabaseSchema>(file);
const defaultData: DatabaseSchema = { carousel: [] };
const db = new Low<DatabaseSchema>(adapter, defaultData);

export async function getCarouselImages() {
  await db.read();
  return db.data.carousel;
}
