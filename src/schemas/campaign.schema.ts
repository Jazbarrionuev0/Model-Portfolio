import { z } from "zod";

// Image schema
export const imageSchema = z.object({
  id: z.number(),
  url: z.string().url("La URL de la imagen no es válida"),
  alt: z.string().min(1, "La descripción alternativa de la imagen es requerida"),
});

// Brand schema
export const brandSchema = z.object({
  name: z.string().min(1, "El nombre de la marca es obligatorio"),
  logo: imageSchema.nullable().refine((val) => val !== null, {
    message: "El logo de la marca es obligatorio",
  }),
  link: z
    .string()
    .min(1, "El Instagram de la marca es obligatorio")
    .refine((val) => !val || /^(?!.*\s)[\w.]+$/.test(val) || /^https?:\/\/(?:www\.)?instagram\.com\/[\w.]+\/?$/.test(val), {
      message: "El formato del usuario de Instagram no es válido",
    }),
});

// Campaign schema
export const campaignSchema = z.object({
  id: z.string().optional(),
  brand: brandSchema,
  description: z.string().min(1, "La descripción de la campaña es obligatoria"),
  image: imageSchema.nullable().refine((val) => val !== null, {
    message: "La imagen principal es obligatoria",
  }),
  images: z.array(imageSchema).min(1, "Tiene que haber al menos una imagen adicional"),
  date: z.date({
    required_error: "La fecha es requerida",
    invalid_type_error: "La fecha no es válida",
  }),
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
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  occupation: z.string().min(2, "La ocupación debe tener al menos 2 caracteres"),
  instagram: z.string().optional(),
  email: z.string().email("La dirección de correo electrónico no es válida"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
