"use server";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { Campaign } from "@/types/campaign";
import { revalidatePath } from "next/cache";
import { Image } from "@/types/image";
import StorageService from "@/lib/storage.service";
import sharp from "sharp";

// Helper functions for consistent logging
function logInfo(message: string, data?: Record<string, unknown>): void {
  console.log(`[CAMPAIGN_ACTION_INFO] ${message}`, data ? JSON.stringify(data) : "");
}

function logError(message: string, error: unknown): void {
  console.error(`[CAMPAIGN_ACTION_ERROR] ${message}`, error);
  // Log additional error details if available
  if (error instanceof Error) {
    console.error(`[CAMPAIGN_ACTION_ERROR_DETAILS] ${error.name}: ${error.message}`);
    console.error(`[CAMPAIGN_ACTION_ERROR_STACK] ${error.stack}`);
  } else if (typeof error === "object" && error !== null) {
    console.error("[CAMPAIGN_ACTION_ERROR_OBJECT]", JSON.stringify(error, null, 2));
  }
}

interface DatabaseSchema {
  campaigns: Campaign[];
}

const file = join(process.cwd(), "data", "db.json");
const adapter = new JSONFile<DatabaseSchema>(file);
const defaultData: DatabaseSchema = { campaigns: [] };
const db = new Low<DatabaseSchema>(adapter, defaultData);

// Maximum file size for validation (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

/**
 * Processes a base64 image string, compresses it, and uploads it to storage
 * @param base64Image Base64 encoded image string
 * @param filename Original filename
 * @param type Image type (hero or carousel)
 * @returns Promise with the uploaded image object
 */
async function processAndUploadImage(base64Image: string, filename: string, type: "hero" | "carousel"): Promise<Image> {
  logInfo("Processing and uploading image", { 
    filename, 
    type,
    base64Length: base64Image.length,
    environment: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL
  });

  try {
    // Validate file size (check base64 string length)
    if (base64Image.length > MAX_FILE_SIZE * 1.37) { // Base64 is roughly 1.37 times larger than binary
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }
    
    // Extract the base64 data (remove the data:image/xxx;base64, prefix)
    const base64Data = base64Image.split(';base64,').pop();
    if (!base64Data) {
      throw new Error("Invalid base64 image format");
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    logInfo("Converted base64 to buffer", { bufferSize: buffer.length });

    // Compress the image using sharp
    logInfo("Compressing image with sharp");
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    logInfo("Image metadata retrieved", { 
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      size: buffer.length
    });

    const compressedBuffer = await image
      .resize({
        width: Math.min(metadata.width || 1920, 1920),
        height: Math.min(metadata.height || 1080, 1080),
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    logInfo("Image compression complete", { 
      originalSize: buffer.length, 
      compressedSize: compressedBuffer.length 
    });

    // Upload to storage service
    logInfo("Starting upload to storage service", {
      filename,
      bufferSize: compressedBuffer.length,
      storageEndpoint: process.env.DO_SPACES_ENDPOINT
    });
    
    const uploadedFilename = await StorageService.upload(compressedBuffer, filename);
    logInfo("Upload to storage service completed", { uploadedFilename });

    // Create image URL
    const imageUrl = `${process.env.DO_SPACES_IMAGE_URL}/${uploadedFilename}`;
    logInfo("Created image URL", { imageUrl });
    
    // Create and return the image object
    const newImage: Image = {
      id: Date.now(),
      url: imageUrl,
      alt: filename.replace(/\.[^/.]+$/, ""), // Remove file extension for alt
      type,
    };
    
    logInfo("Image processed and uploaded successfully", { 
      id: newImage.id,
      type: newImage.type
    });
    
    return newImage;
  } catch (error) {
    logError("Error processing and uploading image", error);
    throw new Error("Failed to process and upload image");
  }
}

export async function getCampaigns() {
  logInfo("Getting all campaigns");
  try {
    await db.read();
    logInfo("Retrieved campaigns", { count: db.data.campaigns.length });
    return db.data.campaigns;
  } catch (error) {
    logError("Error getting campaigns", error);
    throw new Error("Failed to retrieve campaigns");
  }
}

export async function getCampaign(id: string) {
  logInfo("Getting campaign by ID", { id });
  try {
    await db.read();
    const campaign = db.data.campaigns.find((c) => c.id === id);
    
    if (!campaign) {
      logError("Campaign not found", { id });
      throw new Error("Campaign not found");
    }
    
    logInfo("Campaign found", { id, brandName: campaign.brand.name });
    return campaign;
  } catch (error) {
    logError("Error getting campaign by ID", { id, error });
    throw error;
  }
}

export async function createCampaign(campaign: Omit<Campaign, "id">) {
  "use server";
  logInfo("Creating new campaign", { 
    brandName: campaign.brand.name,
    hasLogo: !!campaign.brand.logo?.url,
    hasMainImage: !!campaign.image?.url,
    additionalImagesCount: campaign.images?.length,
    environment: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL
  });
  
  try {
    // Validate required fields
    if (!campaign.brand.name) {
      const error = new Error("Brand name is required");
      logError("Validation error", { error });
      throw error;
    }
    
    if (!campaign.brand.logo?.url) {
      const error = new Error("Brand logo is required");
      logError("Validation error", { error });
      throw error;
    }
    
    if (!campaign.image?.url) {
      const error = new Error("Main image is required");
      logError("Validation error", { error });
      throw error;
    }
    
    logInfo("Campaign validation passed");
    
    // Process and upload images
    logInfo("Processing brand logo");
    const logoUrl = campaign.brand.logo.url as string;
    const logoFilename = campaign.brand.logo.alt || "brand-logo";
    const processedLogo = await processAndUploadImage(logoUrl, `${logoFilename}.jpg`, "hero");
    
    logInfo("Processing main image");
    const mainImageUrl = campaign.image.url as string;
    const mainImageFilename = campaign.image.alt || "main-image";
    const processedMainImage = await processAndUploadImage(mainImageUrl, `${mainImageFilename}.jpg`, "hero");
    
    // Process additional images if any
    const processedAdditionalImages: Image[] = [];
    if (campaign.images && campaign.images.length > 0) {
      logInfo(`Processing ${campaign.images.length} additional images`);
      
      for (let i = 0; i < campaign.images.length; i++) {
        const additionalImage = campaign.images[i];
        if (additionalImage.url) {
          const filename = additionalImage.alt || `additional-image-${i + 1}`;
          const processedImage = await processAndUploadImage(
            additionalImage.url as string,
            `${filename}.jpg`,
            "carousel"
          );
          processedAdditionalImages.push(processedImage);
        }
      }
    }
    
    // Create campaign with processed images
    const campaignWithProcessedImages = {
      ...campaign,
      brand: {
        ...campaign.brand,
        logo: processedLogo
      },
      image: processedMainImage,
      images: processedAdditionalImages
    };
    
    // Read database
    logInfo("Reading database");
    await db.read();
    
    // Create new campaign with ID
    const newCampaign = {
      ...campaignWithProcessedImages,
      id: Date.now().toString(),
    };
    
    logInfo("Generated new campaign ID", { id: newCampaign.id });
    
    // Add to database
    db.data.campaigns.push(newCampaign);
    
    // Write to database
    logInfo("Writing to database", { path: file });
    await db.write();
    
    logInfo("Database write successful");
    
    // Revalidate path
    logInfo("Revalidating path", { path: "/campaigns" });
    revalidatePath("/campaigns");
    
    logInfo("Campaign created successfully", { id: newCampaign.id });
    return newCampaign;
  } catch (error) {
    logError("Error creating campaign", error);
    
    // Log additional details about the campaign data
    try {
      logError("Campaign data at time of error", {
        brandName: campaign.brand.name,
        brandLink: campaign.brand.link,
        hasLogo: !!campaign.brand.logo?.url,
        logoType: campaign.brand.logo?.url ? typeof campaign.brand.logo.url : "undefined",
        hasMainImage: !!campaign.image?.url,
        mainImageType: campaign.image?.url ? typeof campaign.image.url : "undefined",
        additionalImagesCount: campaign.images?.length,
      });
    } catch (logError) {
      console.error("Error logging campaign data", logError);
    }
    
    throw error;
  }
}

export async function updateCampaign(id: string, campaign: Partial<Campaign>) {
  "use server";
  logInfo("Updating campaign", { id });
  
  try {
    await db.read();
    const index = db.data.campaigns.findIndex((c) => c.id === id);
    
    if (index === -1) {
      logError("Campaign not found for update", { id });
      throw new Error("Campaign not found");
    }
    
    logInfo("Found campaign to update", { 
      id, 
      originalBrandName: db.data.campaigns[index].brand.name,
      newBrandName: campaign.brand?.name || db.data.campaigns[index].brand.name
    });

    // Process images if they are being updated
    let updatedCampaign = { ...campaign };
    
    // Process brand logo if it's being updated
    if (campaign.brand?.logo?.url && typeof campaign.brand.logo.url === 'string' && campaign.brand.logo.url.startsWith('data:image')) {
      logInfo("Processing updated brand logo");
      const logoFilename = campaign.brand.logo.alt || "updated-brand-logo";
      const processedLogo = await processAndUploadImage(
        campaign.brand.logo.url,
        `${logoFilename}.jpg`,
        "hero"
      );
      
      updatedCampaign = {
        ...updatedCampaign,
        brand: {
          name: campaign.brand.name || db.data.campaigns[index].brand.name,
          link: campaign.brand.link || db.data.campaigns[index].brand.link,
          logo: processedLogo
        }
      };
    }
    
    // Process main image if it's being updated
    if (campaign.image?.url && typeof campaign.image.url === 'string' && campaign.image.url.startsWith('data:image')) {
      logInfo("Processing updated main image");
      const mainImageFilename = campaign.image.alt || "updated-main-image";
      const processedMainImage = await processAndUploadImage(
        campaign.image.url,
        `${mainImageFilename}.jpg`,
        "hero"
      );
      
      updatedCampaign = {
        ...updatedCampaign,
        image: processedMainImage
      };
    }
    
    // Process additional images if they are being updated
    if (campaign.images && campaign.images.length > 0) {
      const processedAdditionalImages: Image[] = [];
      
      for (let i = 0; i < campaign.images.length; i++) {
        const additionalImage = campaign.images[i];
        
        // Only process new images (those with data:image URLs)
        if (additionalImage.url && typeof additionalImage.url === 'string' && additionalImage.url.startsWith('data:image')) {
          logInfo(`Processing updated additional image ${i + 1}`);
          const filename = additionalImage.alt || `updated-additional-image-${i + 1}`;
          const processedImage = await processAndUploadImage(
            additionalImage.url,
            `${filename}.jpg`,
            "carousel"
          );
          processedAdditionalImages.push(processedImage);
        } else {
          // Keep existing images
          processedAdditionalImages.push(additionalImage);
        }
      }
      
      updatedCampaign = {
        ...updatedCampaign,
        images: processedAdditionalImages
      };
    }

    // Update campaign
    db.data.campaigns[index] = { ...db.data.campaigns[index], ...updatedCampaign };
    
    // Write to database
    logInfo("Writing updated campaign to database");
    await db.write();
    
    // Revalidate path
    logInfo("Revalidating path", { path: "/campaigns" });
    revalidatePath("/campaigns");
    
    logInfo("Campaign updated successfully", { id });
    return db.data.campaigns[index];
  } catch (error) {
    logError("Error updating campaign", { id, error });
    throw error;
  }
}

export async function deleteCampaign(id: string) {
  "use server";
  logInfo("Deleting campaign", { id });
  
  try {
    await db.read();
    const index = db.data.campaigns.findIndex((c) => c.id === id);
    
    if (index === -1) {
      logError("Campaign not found for deletion", { id });
      throw new Error("Campaign not found");
    }
    
    const campaign = db.data.campaigns[index];
    logInfo("Found campaign to delete", { 
      id, 
      brandName: campaign.brand.name 
    });

    // Delete images from storage
    try {
      // Delete brand logo
      if (campaign.brand.logo?.url) {
        logInfo("Deleting brand logo from storage", { url: campaign.brand.logo.url });
        await StorageService.delete(campaign.brand.logo.url);
      }
      
      // Delete main image
      if (campaign.image?.url) {
        logInfo("Deleting main image from storage", { url: campaign.image.url });
        await StorageService.delete(campaign.image.url);
      }
      
      // Delete additional images
      if (campaign.images && campaign.images.length > 0) {
        logInfo(`Deleting ${campaign.images.length} additional images from storage`);
        for (const image of campaign.images) {
          if (image.url) {
            logInfo("Deleting additional image from storage", { url: image.url });
            await StorageService.delete(image.url);
          }
        }
      }
    } catch (deleteError) {
      logError("Error deleting images from storage", deleteError);
      // Continue with campaign deletion even if image deletion fails
    }

    // Remove from array
    db.data.campaigns.splice(index, 1);
    
    // Write to database
    logInfo("Writing to database after deletion");
    await db.write();
    
    // Revalidate path
    logInfo("Revalidating path", { path: "/campaigns" });
    revalidatePath("/campaigns");
    
    logInfo("Campaign deleted successfully", { id });
    return { success: true };
  } catch (error) {
    logError("Error deleting campaign", { id, error });
    throw error;
  }
}
