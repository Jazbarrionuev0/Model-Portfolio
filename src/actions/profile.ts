"use server";

import { revalidatePath } from "next/cache";
import { Profile } from "@/types/profile";
import { createProfile, getProfile, updateProfile } from "@/db/database";

export async function getProfileAction(): Promise<Profile> {
  try {
    return await getProfile();
  } catch (error) {
    console.error("Failed to get profile:", error);
    throw new Error("Failed to get profile");
  }
}

export async function createProfileAction(profile: Profile): Promise<Profile> {
  try {
    const newProfile = await createProfile(profile);
    revalidatePath("/");
    return newProfile;
  } catch (error) {
    console.error("Failed to create profile:", error);
    throw new Error("Failed to create profile");
  }
}

export async function updateProfileAction(profile: Profile): Promise<Profile> {
  try {
    const updatedProfile = await updateProfile(profile);
    revalidatePath("/");
    return updatedProfile;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Failed to update profile");
  }
}
