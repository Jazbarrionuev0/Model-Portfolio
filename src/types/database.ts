import { Image } from './image';

export interface Database {
  hero: Image[];
  carousel: Image[];
  [key: string]: Image[] | unknown;
}
