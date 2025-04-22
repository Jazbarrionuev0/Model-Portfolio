import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// Remove the direct import and use dynamic import later
// import heic2any from "heic2any";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logInfo(message: string, data?: Record<string, unknown>): void {
  console.log(`[CAMPAIGN_FORM_INFO] ${message}`, data ? JSON.stringify(data) : "");
}

export function logError(message: string, error: unknown): void {
  console.error(`[CAMPAIGN_FORM_ERROR] ${message}`, error);
  if (error instanceof Error) {
    console.error(`[CAMPAIGN_FORM_ERROR_DETAILS] ${error.name}: ${error.message}`);
    console.error(`[CAMPAIGN_FORM_ERROR_STACK] ${error.stack}`);
  } else if (typeof error === "object" && error !== null) {
    console.error("[CAMPAIGN_FORM_ERROR_OBJECT]", JSON.stringify(error, null, 2));
  }
}

export function getImageUrl(path: string): string {
  return `${process.env.DO_SPACES_IMAGE_URL}/${path}`;
}

/**
 * Converts HEIC/HEIF image files to JPEG for client-side preview
 * @param file The file to convert if necessary
 * @returns A Promise that resolves to a File or Blob in JPEG format, or the original file if not HEIC/HEIF
 */
export async function convertForPreview(file: File): Promise<File | Blob> {
  // Check if code is running in a browser environment
  if (typeof window === "undefined") {
    // We're on the server, just return the original file
    return file;
  }

  const fileType = file.type.toLowerCase();
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  // Check if the file is HEIC/HEIF format
  const isHeicHeif = ["heic", "heif"].includes(extension) || fileType === "image/heic" || fileType === "image/heif";

  if (isHeicHeif) {
    logInfo("Converting HEIC/HEIF to JPEG for preview", { filename: file.name, type: file.type });
    try {
      // Dynamically import heic2any only on the client side
      const heic2any = (await import("heic2any")).default;

      // Convert to JPEG blob
      const jpegBlob = (await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8,
      })) as Blob;

      // Create a new file with proper name and type
      const convertedFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), { type: "image/jpeg" });

      logInfo("HEIC/HEIF conversion successful", { newType: "image/jpeg" });
      return convertedFile;
    } catch (error) {
      logError("Failed to convert HEIC/HEIF image for preview", error);
      throw new Error("Could not convert image for preview. Please try a different image format.");
    }
  }

  // Return the original file if not HEIC/HEIF
  return file;
}
