import { Image } from "@/types/image";
import { deleteImageAction } from "@/actions/delete";
import { BaseRepository } from "./baseRepository";
import { logInfo } from "@/lib/utils";

export class ImageRepository extends BaseRepository<Image> {
  constructor(key: string) {
    super(key);
  }

  async getImages(): Promise<Image[]> {
    return this.getAll();
  }

  async addImage(image: Image): Promise<Image> {
    logInfo(`Adding ${this.key} image`, { imageId: image.id });
    const newImage = await this.add(image);
    logInfo(`${this.key} image added successfully`, { imageId: newImage.id });
    return newImage;
  }

  async deleteImage(id: number): Promise<void> {
    logInfo(`Deleting ${this.key} image`, { imageId: id });
    const imageToDelete = await this.delete(id);
    await deleteImageAction(imageToDelete.url);
    logInfo(`${this.key} image deleted successfully`, { imageId: id });
  }
}
