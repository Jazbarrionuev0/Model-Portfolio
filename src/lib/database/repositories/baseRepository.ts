import { logError } from "@/lib/utils";
import { getRedisData, setRedisData } from "../redis";

export abstract class BaseRepository<T extends { id: number }> {
  protected key: string;

  constructor(key: string) {
    this.key = key;
  }

  protected async getAll(): Promise<T[]> {
    return getRedisData<T>(this.key);
  }

  protected async add(item: Omit<T, "id">): Promise<T> {
    const items = await this.getAll();
    const newItem = {
      ...item,
      id: Date.now(),
    } as T;
    items.push(newItem);
    await setRedisData(this.key, items);
    return newItem;
  }

  protected async update(item: T): Promise<void> {
    const items = await this.getAll();
    const index = items.findIndex((i) => i.id === item.id);
    if (index === -1) {
      const error = new Error(`${this.key} item not found`);
      logError(`${this.key} item not found for update`, { itemId: item.id, error });
      throw error;
    }
    items[index] = item;
    await setRedisData(this.key, items);
  }

  protected async delete(id: number): Promise<T> {
    const items = await this.getAll();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      const error = new Error(`${this.key} item not found`);
      logError(`${this.key} item not found for deletion`, { itemId: id, error });
      throw error;
    }
    const itemToDelete = items[index];
    items.splice(index, 1);
    await setRedisData(this.key, items);
    return itemToDelete;
  }

  protected async getById(id: number): Promise<T> {
    const items = await this.getAll();
    const item = items.find((i) => i.id === id);
    if (!item) {
      const error = new Error(`${this.key} item not found`);
      logError(`${this.key} item not found`, { itemId: id, error });
      throw error;
    }
    return item;
  }
}
