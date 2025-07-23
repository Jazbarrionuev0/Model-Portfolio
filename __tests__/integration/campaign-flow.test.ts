/**
 * Integration Tests for Campaign Management Flow
 *
 * These tests verify the complete flow from server actions to database operations
 * for campaign management functionality.
 */
import { getCampaignsAction, addCampaignAction, deleteCampaignAction } from "@/actions/campaign";
import { Campaign } from "@/types/campaign";

// Mock Redis operations
const mockRedisData: { [key: string]: string } = {};

jest.mock("@/lib/database/redis", () => ({
  getRedisClient: jest.fn(() => ({
    get: jest.fn((key: string) => Promise.resolve(mockRedisData[key] || null)),
    set: jest.fn((key: string, value: string) => {
      mockRedisData[key] = value;
      return Promise.resolve();
    }),
  })),
  getRedisData: jest.fn((key: string) => {
    const data = mockRedisData[key];
    return Promise.resolve(data ? JSON.parse(data) : []);
  }),
  setRedisData: jest.fn((key: string, value: unknown[]) => {
    mockRedisData[key] = JSON.stringify(value);
    return Promise.resolve();
  }),
}));

// Mock Next.js cache revalidation
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock storage service
jest.mock("@/lib/storage.service", () => ({
  delete: jest.fn().mockResolvedValue(undefined),
}));

// Mock delete action
jest.mock("@/actions/delete", () => ({
  deleteImageAction: jest.fn().mockResolvedValue(undefined),
}));

describe("Campaign Management Integration", () => {
  const mockCampaign: Omit<Campaign, "id"> = {
    brand: {
      name: "Integration Test Brand",
      logo: {
        id: 1,
        url: "https://example.com/logo.jpg",
        alt: "Brand logo",
      },
      link: "testbrand",
    },
    description: "Integration test campaign description",
    image: {
      id: 2,
      url: "https://example.com/main-image.jpg",
      alt: "Main campaign image",
    },
    images: [
      {
        id: 3,
        url: "https://example.com/additional-image.jpg",
        alt: "Additional image",
      },
    ],
    date: new Date("2024-01-01"),
  };

  beforeEach(() => {
    // Clear mock data before each test
    Object.keys(mockRedisData).forEach((key) => {
      delete mockRedisData[key];
    });
    jest.clearAllMocks();
  });

  describe("Campaign CRUD Operations", () => {
    it("should complete full campaign lifecycle", async () => {
      // 1. Initially no campaigns
      let campaigns = await getCampaignsAction();
      expect(campaigns).toEqual([]);

      // 2. Add a campaign
      const addedCampaign = await addCampaignAction(mockCampaign);
      expect(addedCampaign).toMatchObject(mockCampaign);
      expect(addedCampaign.id).toBeDefined();

      // 3. Verify campaign was added
      campaigns = await getCampaignsAction();
      expect(campaigns).toHaveLength(1);
      expect(campaigns[0]).toMatchObject(mockCampaign);

      // 4. Delete the campaign
      await deleteCampaignAction(addedCampaign.id);

      // 5. Verify campaign was deleted
      campaigns = await getCampaignsAction();
      expect(campaigns).toEqual([]);
    });

    it("should handle multiple campaigns", async () => {
      // Add first campaign
      const campaign1 = await addCampaignAction({
        ...mockCampaign,
        brand: { ...mockCampaign.brand, name: "Brand 1" },
      });

      // Add second campaign
      const campaign2 = await addCampaignAction({
        ...mockCampaign,
        brand: { ...mockCampaign.brand, name: "Brand 2" },
      });

      // Verify both campaigns exist
      const campaigns = await getCampaignsAction();
      expect(campaigns).toHaveLength(2);
      expect(campaigns.find((c) => c.id === campaign1.id)?.brand.name).toBe("Brand 1");
      expect(campaigns.find((c) => c.id === campaign2.id)?.brand.name).toBe("Brand 2");
    });

    it("should maintain data integrity during operations", async () => {
      // Add multiple campaigns

      const campaign2 = await addCampaignAction({
        ...mockCampaign,
        description: "Campaign 2",
      });

      // Delete middle campaign
      await deleteCampaignAction(campaign2.id);

      // Verify other campaigns remain
      const remainingCampaigns = await getCampaignsAction();
      expect(remainingCampaigns).toHaveLength(2);

      const descriptions = remainingCampaigns.map((c) => c.description);
      expect(descriptions).toContain("Campaign 1");
      expect(descriptions).toContain("Campaign 3");
      expect(descriptions).not.toContain("Campaign 2");
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      // Mock a database error
      const { getRedisData } = await import("@/lib/database/redis");
      (getRedisData as jest.Mock).mockRejectedValueOnce(new Error("Database connection failed"));

      await expect(getCampaignsAction()).rejects.toThrow("Database connection failed");
    });

    it("should handle deletion of non-existent campaign", async () => {
      await expect(deleteCampaignAction(999)).rejects.toThrow("campaigns item not found");
    });
  });

  describe("Data Persistence", () => {
    it("should persist campaigns between operations", async () => {
      // Add a campaign
      const addedCampaign = await addCampaignAction(mockCampaign);

      // Simulate application restart by clearing mocks but keeping data
      jest.clearAllMocks();

      // Verify campaign still exists
      const campaigns = await getCampaignsAction();
      expect(campaigns).toHaveLength(1);
      expect(campaigns[0].id).toBe(addedCampaign.id);
    });
  });
});
