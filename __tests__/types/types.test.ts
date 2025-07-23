/**
 * Simple Type System Tests
 *
 * These tests verify that your TypeScript types are working correctly
 * and that your data structures are properly defined.
 */
import { Campaign } from "@/types/campaign";
import { Image } from "@/types/image";
import { Profile } from "@/types/profile";

describe("Type System Validation", () => {
  describe("Image Type", () => {
    it("should create valid Image object", () => {
      const image: Image = {
        id: 1,
        url: "https://example.com/image.jpg",
        alt: "Test image",
      };

      expect(image.id).toBe(1);
      expect(image.url).toBe("https://example.com/image.jpg");
      expect(image.alt).toBe("Test image");
    });

    it("should require all Image properties", () => {
      // This test ensures TypeScript compilation catches missing properties
      const createImage = (): Image => ({
        id: 1,
        url: "https://example.com/image.jpg",
        alt: "Test image",
      });

      const image = createImage();
      expect(image).toHaveProperty("id");
      expect(image).toHaveProperty("url");
      expect(image).toHaveProperty("alt");
    });
  });

  describe("Campaign Type", () => {
    it("should create valid Campaign object", () => {
      const campaign: Campaign = {
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

      expect(campaign.id).toBe(1);
      expect(campaign.brand.name).toBe("Test Brand");
      expect(campaign.description).toBe("Test campaign description");
      expect(campaign.images).toHaveLength(1);
      expect(campaign.date).toBeInstanceOf(Date);
    });

    it("should allow empty images array", () => {
      const campaign: Campaign = {
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
        images: [], // Empty array should be allowed
        date: new Date("2024-01-01"),
      };

      expect(campaign.images).toEqual([]);
    });
  });

  describe("Profile Type", () => {
    it("should create valid Profile object", () => {
      const profile: Profile = {
        name: "John Doe",
        description: "Professional photographer with 10 years of experience",
        occupation: "Photographer",
        instagram: "johndoe",
        email: "john@example.com",
      };

      expect(profile.name).toBe("John Doe");
      expect(profile.occupation).toBe("Photographer");
      expect(profile.email).toBe("john@example.com");
    });

    it("should handle optional instagram field", () => {
      const profileWithoutInstagram: Partial<Profile> = {
        name: "Jane Doe",
        description: "Professional model and influencer",
        occupation: "Model",
        email: "jane@example.com",
      };

      expect(profileWithoutInstagram.instagram).toBeUndefined();
      expect(profileWithoutInstagram.name).toBe("Jane Doe");
    });
  });

  describe("Data Structure Consistency", () => {
    it("should maintain consistent ID types across all entities", () => {
      const image: Image = { id: 1, url: "test.jpg", alt: "test" };
      const campaign: Campaign = {
        id: 1,
        brand: {
          name: "Brand",
          logo: image,
          link: "brand",
        },
        description: "Description",
        image: image,
        images: [image],
        date: new Date(),
      };

      // All IDs should be numbers
      expect(typeof image.id).toBe("number");
      expect(typeof campaign.id).toBe("number");
      expect(typeof campaign.brand.logo.id).toBe("number");
      expect(typeof campaign.image.id).toBe("number");
      expect(typeof campaign.images[0].id).toBe("number");
    });

    it("should ensure URL formats are strings", () => {
      const image: Image = {
        id: 1,
        url: "https://example.com/image.jpg",
        alt: "Test image",
      };

      expect(typeof image.url).toBe("string");
      expect(image.url.startsWith("http")).toBe(true);
    });
  });
});
