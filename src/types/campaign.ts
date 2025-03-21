import { Image } from "./image";

export interface Brand {
  name: string;
  logo: Image;
  link: string;
}

export interface Campaign {
  id: number;
  brand: Brand;
  description: string;
  image: Image;
  images: Image[];
  date: Date;
}
