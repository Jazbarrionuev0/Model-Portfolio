/**
 * App startup configuration checker
 * Add this to your app's root layout or startup process
 */

import { validateAppConfig } from "@/lib/config-validator";
import { logger } from "@/lib/logger";

export function checkAppConfiguration() {
  logger.info("Starting application configuration check", "STARTUP");

  try {
    const validator = validateAppConfig();
    const report = validator.getReport();

    // Log the configuration report
    logger.info("Configuration report generated", "STARTUP");
    console.log(report); // Always show configuration report

    const validation = validator.validateAll();

    if (!validation.isValid) {
      const errorMessage = `Application startup failed due to missing required configuration: ${validation.missingRequired.join(", ")}`;
      logger.error(errorMessage, "STARTUP");

      if (process.env.NODE_ENV === "production") {
        // In production, we should fail fast if configuration is invalid
        throw new Error(errorMessage);
      } else {
        // In development, just warn but continue
        console.warn("⚠️  Development mode: Continuing despite missing configuration");
      }
    }

    if (validation.warnings.length > 0) {
      logger.warn(`Optional configuration missing: ${validation.warnings.join(", ")}`, "STARTUP");
    }

    logger.info("Application configuration check completed", "STARTUP", {
      isValid: validation.isValid,
      missingRequired: validation.missingRequired.length,
      warnings: validation.warnings.length,
    });

    return validation;
  } catch (error) {
    logger.error("Configuration check failed", "STARTUP", error as Error);
    throw error;
  }
}

// Development helper - logs environment for debugging
export function logEnvironmentInfo() {
  if (process.env.NODE_ENV === "development") {
    logger.debug("Environment info", "DEBUG", {
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
      // Don't log sensitive values, just their presence
      hasRedis: !!process.env.REDIS,
      hasDoSpacesEndpoint: !!process.env.DO_SPACES_ENDPOINT,
      hasDoSpacesKey: !!process.env.DO_SPACES_KEY,
      hasPassword: !!process.env.NEXT_PUBLIC_PASSWORD,
    });
  }
}
