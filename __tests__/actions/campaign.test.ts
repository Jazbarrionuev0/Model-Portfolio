import { getCampaignsAction, getCampaignAction, addCampaignAction, updateCampaignAction, deleteCampaignAction } from "@/actions/campaign";
import { Campaign } from "@/types/campaign";

// Mock the database functions
jest.mock("@/lib/database", () => ({
  getCampaigns: jest.fn(),
  getCampaign: jest.fn(),
  addCampaign: jest.fn(),
  updateCampaign: jest.fn(),
  deleteCampaign: jest.fn(),
}));

// Mock Next.js revalidatePath
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Campaign Actions", () => {
  // Mock database functions
  const mockGetCampaigns = require("@/lib/database").getCampaigns as jest.Mock;
  const mockGetCampaign = require("@/lib/database").getCampaign as jest.Mock;
  const mockAddCampaign = require("@/lib/database").addCampaign as jest.Mock;
  const mockUpdateCampaign = require("@/lib/database").updateCampaign as jest.Mock;
  const mockDeleteCampaign = require("@/lib/database").deleteCampaign as jest.Mock;

  const mockCampaign: Campaign = {
    id: 1,
    brand: {
      name: "Test Brand",
      logo: {
        id: 1,
        url: "https://example.com/logo.jpg",
        alt: "Brand logo",
      },
      link: "testbrand",
    },
    description: "Test campaign description",
    image: {
      id: 2,
      url: "https://example.com/image.jpg",
      alt: "Campaign image",
    },
    images: [
      {
        id: 3,
        url: "https://example.com/image2.jpg",
        alt: "Additional image",
      },
    ],
    date: new Date("2024-01-01"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCampaignsAction", () => {
    it("should return campaigns from database", async () => {
      const mockCampaigns = [mockCampaign];
      mockGetCampaigns.mockResolvedValue(mockCampaigns);

      const result = await getCampaignsAction();

      expect(result).toEqual(mockCampaigns);
      expect(mockGetCampaigns).toHaveBeenCalledTimes(1);
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      mockGetCampaigns.mockRejectedValue(error);

      await expect(getCampaignsAction()).rejects.toThrow("Database error");
    });
  });

  describe("getCampaignAction", () => {
    it("should return specific campaign by ID", async () => {
      mockGetCampaign.mockResolvedValue(mockCampaign);

      const result = await getCampaignAction(1);

      expect(result).toEqual(mockCampaign);
      expect(mockGetCampaign).toHaveBeenCalledWith(1);
    });

    it("should handle campaign not found", async () => {
      const error = new Error("Campaign not found");
      mockGetCampaign.mockRejectedValue(error);

      await expect(getCampaignAction(999)).rejects.toThrow("Campaign not found");
    });
  });

  describe("addCampaignAction", () => {
    it("should add campaign successfully", async () => {
      const newCampaign = { ...mockCampaign };
      delete (newCampaign as Partial<Campaign>).id;

      mockAddCampaign.mockResolvedValue(mockCampaign);

      const result = await addCampaignAction(newCampaign);

      expect(result).toEqual(mockCampaign);
      expect(mockAddCampaign).toHaveBeenCalledWith(newCampaign);
    });

    it("should handle add errors and re-throw them", async () => {
      const newCampaign = { ...mockCampaign };
      delete (newCampaign as Partial<Campaign>).id;
      const error = new Error("Database error");

      mockAddCampaign.mockRejectedValue(error);

      await expect(addCampaignAction(newCampaign)).rejects.toThrow("Database error");
    });
  });

  describe("updateCampaignAction", () => {
    it("should update campaign successfully", async () => {
      mockUpdateCampaign.mockResolvedValue(mockCampaign);

      const result = await updateCampaignAction(mockCampaign);

      expect(result).toEqual(mockCampaign);
      expect(mockUpdateCampaign).toHaveBeenCalledWith(mockCampaign);
    });

    it("should handle update errors", async () => {
      const error = new Error("Update failed");
      mockUpdateCampaign.mockRejectedValue(error);

      await expect(updateCampaignAction(mockCampaign)).rejects.toThrow("Update failed");
    });
  });

  describe("deleteCampaignAction", () => {
    it("should delete campaign successfully", async () => {
      const mockResult = { success: true };
      mockDeleteCampaign.mockResolvedValue(mockResult);

      const result = await deleteCampaignAction(1);

      expect(result).toEqual(mockResult);
      expect(mockDeleteCampaign).toHaveBeenCalledWith(1);
    });

    it("should handle deletion errors", async () => {
      const error = new Error("Deletion failed");
      mockDeleteCampaign.mockRejectedValue(error);

      await expect(deleteCampaignAction(1)).rejects.toThrow("Deletion failed");
    });
  });
});
