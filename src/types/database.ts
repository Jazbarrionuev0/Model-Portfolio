import { Campaign } from "./campaign";
import { Image } from "./image";

export interface Database {
  hero: Image[];
  carousel: Image[];
  campaigns: Campaign[];
}
