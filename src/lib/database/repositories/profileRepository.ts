import { Profile } from "@/types/profile";
import { getRedisClient } from "../redis";
import { logError, logInfo } from "@/lib/utils";

export class ProfileRepository {
  private key = "profile";

  async getProfile(): Promise<Profile> {
    try {
      logInfo("Fetching profile");
      const client = await getRedisClient();
      const data = await client.get(this.key);
      if (!data) {
        throw new Error("Profile not found");
      }
      return JSON.parse(data);
    } catch (error) {
      logError("Error fetching profile", error);
      throw error;
    }
  }

  async createProfile(profile: Profile): Promise<Profile> {
    try {
      logInfo("Creating profile");
      const client = await getRedisClient();
      await client.set(this.key, JSON.stringify(profile));
      logInfo("Profile created successfully");
      return profile;
    } catch (error) {
      logError("Error creating profile", error);
      throw error;
    }
  }

  async updateProfile(profile: Profile): Promise<Profile> {
    try {
      logInfo("Updating profile");
      const client = await getRedisClient();
      await client.set(this.key, JSON.stringify(profile));
      logInfo("Profile updated successfully");
      return profile;
    } catch (error) {
      logError("Error updating profile", error);
      throw error;
    }
  }
}
