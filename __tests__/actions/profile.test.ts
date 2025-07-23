import { getProfileAction, createProfileAction, updateProfileAction } from "@/actions/profile";
import { Profile } from "@/types/profile";

// Mock the database functions
jest.mock("@/lib/database", () => ({
  getProfile: jest.fn(),
  createProfile: jest.fn(),
  updateProfile: jest.fn(),
}));

// Mock Next.js revalidatePath
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Profile Actions", () => {
  const mockProfile: Profile = {
    name: "John Doe",
    description: "Professional photographer with 10 years of experience",
    occupation: "Photographer",
    instagram: "johndoe",
    email: "john@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfileAction", () => {
    it("should return profile from database", async () => {
      const { getProfile } = await import("@/lib/database");
      (getProfile as jest.Mock).mockResolvedValue(mockProfile);

      const result = await getProfileAction();

      expect(result).toEqual(mockProfile);
    });

    it("should handle profile not found error", async () => {
      const { getProfile } = await import("@/lib/database");
      (getProfile as jest.Mock).mockRejectedValue(new Error("Profile not found"));

      await expect(getProfileAction()).rejects.toThrow("Failed to get profile");
    });
  });

  describe("createProfileAction", () => {
    it("should create profile successfully", async () => {
      const { createProfile } = await import("@/lib/database");
      (createProfile as jest.Mock).mockResolvedValue(mockProfile);

      const result = await createProfileAction(mockProfile);

      expect(result).toEqual(mockProfile);
      expect(createProfile).toHaveBeenCalledWith(mockProfile);
    });

    it("should handle create errors", async () => {
      const { createProfile } = await import("@/lib/database");
      (createProfile as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(createProfileAction(mockProfile)).rejects.toThrow("Failed to create profile");
    });
  });

  describe("updateProfileAction", () => {
    it("should update profile successfully", async () => {
      const { updateProfile } = await import("@/lib/database");
      (updateProfile as jest.Mock).mockResolvedValue(mockProfile);

      const result = await updateProfileAction(mockProfile);

      expect(result).toEqual(mockProfile);
      expect(updateProfile).toHaveBeenCalledWith(mockProfile);
    });

    it("should handle update errors", async () => {
      const { updateProfile } = await import("@/lib/database");
      (updateProfile as jest.Mock).mockRejectedValue(new Error("Update failed"));

      await expect(updateProfileAction(mockProfile)).rejects.toThrow("Failed to update profile");
    });
  });
});
