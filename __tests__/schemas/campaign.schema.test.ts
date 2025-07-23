import { imageSchema, brandSchema, profileFormSchema } from "@/schemas/campaign.schema";

describe("Campaign Schemas", () => {
  describe("imageSchema", () => {
    it("should validate a correct image object", () => {
      const validImage = {
        id: 1,
        url: "https://example.com/image.jpg",
        alt: "Test image",
      };

      const result = imageSchema.safeParse(validImage);
      expect(result.success).toBe(true);
    });

    it("should reject invalid URL", () => {
      const invalidImage = {
        id: 1,
        url: "invalid-url",
        alt: "Test image",
      };

      const result = imageSchema.safeParse(invalidImage);
      expect(result.success).toBe(false);
    });

    it("should reject empty alt text", () => {
      const invalidImage = {
        id: 1,
        url: "https://example.com/image.jpg",
        alt: "",
      };

      const result = imageSchema.safeParse(invalidImage);
      expect(result.success).toBe(false);
    });
  });

  describe("brandSchema", () => {
    it("should validate a correct brand object", () => {
      const validBrand = {
        name: "Test Brand",
        logo: {
          id: 1,
          url: "https://example.com/logo.jpg",
          alt: "Brand logo",
        },
        link: "testbrand",
      };

      const result = brandSchema.safeParse(validBrand);
      expect(result.success).toBe(true);
    });

    it("should reject brand with null logo", () => {
      const invalidBrand = {
        name: "Test Brand",
        logo: null,
        link: "testbrand",
      };

      const result = brandSchema.safeParse(invalidBrand);
      expect(result.success).toBe(false);
    });

    it("should validate Instagram URL format", () => {
      const brandWithUrl = {
        name: "Test Brand",
        logo: {
          id: 1,
          url: "https://example.com/logo.jpg",
          alt: "Brand logo",
        },
        link: "https://www.instagram.com/testbrand/",
      };

      const result = brandSchema.safeParse(brandWithUrl);
      expect(result.success).toBe(true);
    });

    it("should reject invalid Instagram format", () => {
      const invalidBrand = {
        name: "Test Brand",
        logo: {
          id: 1,
          url: "https://example.com/logo.jpg",
          alt: "Brand logo",
        },
        link: "invalid instagram handle with spaces",
      };

      const result = brandSchema.safeParse(invalidBrand);
      expect(result.success).toBe(false);
    });
  });

  describe("profileFormSchema", () => {
    it("should validate a correct profile", () => {
      const validProfile = {
        name: "John Doe",
        description: "A professional photographer with 10 years of experience",
        occupation: "Photographer",
        instagram: "johndoe",
        email: "john@example.com",
      };

      const result = profileFormSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    it("should reject short name", () => {
      const invalidProfile = {
        name: "J",
        description: "A professional photographer with 10 years of experience",
        occupation: "Photographer",
        email: "john@example.com",
      };

      const result = profileFormSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });

    it("should reject invalid email", () => {
      const invalidProfile = {
        name: "John Doe",
        description: "A professional photographer with 10 years of experience",
        occupation: "Photographer",
        email: "invalid-email",
      };

      const result = profileFormSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });

    it("should accept optional instagram field", () => {
      const profileWithoutInstagram = {
        name: "John Doe",
        description: "A professional photographer with 10 years of experience",
        occupation: "Photographer",
        email: "john@example.com",
      };

      const result = profileFormSchema.safeParse(profileWithoutInstagram);
      expect(result.success).toBe(true);
    });
  });
});
