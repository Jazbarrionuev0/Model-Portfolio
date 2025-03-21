import { z } from "zod";

// Image schema
export const imageSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  alt: z.string(),
});

// Brand schema
export const brandSchema = z.object({
  name: z.string().min(1),
  logo: imageSchema,
  link: z.string(),
});

// Campaign schema
export const campaignSchema = z.object({
  id: z.string().optional(),
  brand: brandSchema,
  description: z.string(),
  image: imageSchema,
  images: z.array(imageSchema),
  date: z.date(),
});

// Separate schema for campaign creation (without id)
export const createCampaignSchema = campaignSchema.omit({ id: true });

export const defaultCreateCampaignSchema: CreateCampaignSchema = {
  brand: {
    name: "",
    logo: {
      id: 0,
      url: "",
      alt: "",
    },
    link: "",
  },
  description: "",
  image: {
    id: 0,
    url: "",
    alt: "",
  },
  images: [],
  date: new Date(),
};

export type BrandSchema = z.infer<typeof brandSchema>;
export type CampaignSchema = z.infer<typeof campaignSchema>;
export type ImageSchema = z.infer<typeof imageSchema>;
export type CreateCampaignSchema = z.infer<typeof createCampaignSchema>;

export const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  occupation: z.string().min(2, "Occupation must be at least 2 characters"),
  instagram: z.string().optional(),
  email: z.string().email("Invalid email address"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
