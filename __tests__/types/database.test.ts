import { Database } from "@/types/database";
import { Campaign } from "@/types/campaign";
import { Image } from "@/types/image";

describe("Database Types", () => {
  describe("Database interface", () => {
    it("should have correct structure", () => {
      const mockDatabase: Database = {
        hero: [],
        carousel: [],
        campaigns: [],
      };

      expect(mockDatabase).toHaveProperty("hero");
      expect(mockDatabase).toHaveProperty("carousel");
      expect(mockDatabase).toHaveProperty("campaigns");
      expect(Array.isArray(mockDatabase.hero)).toBe(true);
      expect(Array.isArray(mockDatabase.carousel)).toBe(true);
      expect(Array.isArray(mockDatabase.campaigns)).toBe(true);
    });

    it("should accept valid image arrays for hero", () => {
      const mockImages: Image[] = [
        { id: 1, url: "test1.jpg", alt: "Test 1" },
        { id: 2, url: "test2.jpg", alt: "Test 2" },
      ];

      const database: Database = {
        hero: mockImages,
        carousel: [],
        campaigns: [],
      };

      expect(database.hero).toEqual(mockImages);
      expect(database.hero.length).toBe(2);
    });

    it("should accept valid image arrays for carousel", () => {
      const mockImages: Image[] = [
        { id: 3, url: "carousel1.jpg", alt: "Carousel 1" },
        { id: 4, url: "carousel2.jpg", alt: "Carousel 2" },
      ];

      const database: Database = {
        hero: [],
        carousel: mockImages,
        campaigns: [],
      };

      expect(database.carousel).toEqual(mockImages);
      expect(database.carousel.length).toBe(2);
    });

    it("should accept valid campaign arrays", () => {
      const mockCampaigns: Campaign[] = [
        {
          id: 1,
          brand: {
            name: "Test Brand",
            logo: { id: 1, url: "logo.jpg", alt: "Logo" },
            link: "test-brand",
          },
          description: "Test campaign",
          image: { id: 2, url: "main.jpg", alt: "Main image" },
          images: [],
          date: new Date("2024-01-01"),
        },
      ];

      const database: Database = {
        hero: [],
        carousel: [],
        campaigns: mockCampaigns,
      };

      expect(database.campaigns).toEqual(mockCampaigns);
      expect(database.campaigns.length).toBe(1);
    });

    it("should work with populated database", () => {
      const mockHeroImages: Image[] = [{ id: 1, url: "hero1.jpg", alt: "Hero 1" }];

      const mockCarouselImages: Image[] = [{ id: 2, url: "carousel1.jpg", alt: "Carousel 1" }];

      const mockCampaigns: Campaign[] = [
        {
          id: 1,
          brand: {
            name: "Brand A",
            logo: { id: 3, url: "brandA.jpg", alt: "Brand A Logo" },
            link: "brand-a",
          },
          description: "Campaign description",
          image: { id: 4, url: "campaign1.jpg", alt: "Campaign image" },
          images: [{ id: 5, url: "extra1.jpg", alt: "Extra 1" }],
          date: new Date("2024-02-01"),
        },
      ];

      const database: Database = {
        hero: mockHeroImages,
        carousel: mockCarouselImages,
        campaigns: mockCampaigns,
      };

      expect(database.hero.length).toBe(1);
      expect(database.carousel.length).toBe(1);
      expect(database.campaigns.length).toBe(1);

      // Verify type consistency
      expect(database.hero[0]).toHaveProperty("id");
      expect(database.hero[0]).toHaveProperty("url");
      expect(database.hero[0]).toHaveProperty("alt");

      expect(database.campaigns[0]).toHaveProperty("id");
      expect(database.campaigns[0]).toHaveProperty("brand");
      expect(database.campaigns[0]).toHaveProperty("description");
      expect(database.campaigns[0]).toHaveProperty("image");
      expect(database.campaigns[0]).toHaveProperty("images");
      expect(database.campaigns[0]).toHaveProperty("date");
    });
  });
});
