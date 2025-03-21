import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
