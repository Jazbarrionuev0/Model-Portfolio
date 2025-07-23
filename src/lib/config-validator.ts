/**
 * Environment configuration checker and validator
 */

import { logger } from "./logger";

export interface ConfigCheck {
  key: string;
  required: boolean;
  description: string;
  hasValue: boolean;
  value?: string;
}

export class ConfigValidator {
  private checks: ConfigCheck[] = [];

  check(key: string, required: boolean = true, description: string = ""): ConfigCheck {
    const value = process.env[key];
    const hasValue = Boolean(value && value.trim().length > 0);

    const check: ConfigCheck = {
      key,
      required,
      description,
      hasValue,
      value: hasValue ? value : undefined,
    };

    this.checks.push(check);
    logger.configCheck(key, hasValue, required);

    return check;
  }

  validateAll(): { isValid: boolean; missingRequired: string[]; warnings: string[] } {
    const missingRequired: string[] = [];
    const warnings: string[] = [];

    for (const check of this.checks) {
      if (check.required && !check.hasValue) {
        missingRequired.push(check.key);
      } else if (!check.required && !check.hasValue) {
        warnings.push(check.key);
      }
    }

    const isValid = missingRequired.length === 0;

    if (!isValid) {
      logger.error("Configuration validation failed", "CONFIG", undefined, {
        missingRequired,
        warnings,
        totalChecks: this.checks.length,
      });
    } else {
      logger.info("Configuration validation passed", "CONFIG", {
        totalChecks: this.checks.length,
        warnings: warnings.length,
      });
    }

    return { isValid, missingRequired, warnings };
  }

  getReport(): string {
    const lines = ["=== Configuration Report ==="];

    for (const check of this.checks) {
      const status = check.hasValue ? "✅" : check.required ? "❌" : "⚠️";
      const requiredLabel = check.required ? "(REQUIRED)" : "(OPTIONAL)";
      lines.push(`${status} ${check.key} ${requiredLabel} - ${check.description}`);
    }

    const validation = this.validateAll();
    lines.push("");
    lines.push(`Total checks: ${this.checks.length}`);
    lines.push(`Missing required: ${validation.missingRequired.length}`);
    lines.push(`Warnings: ${validation.warnings.length}`);

    return lines.join("\n");
  }
}

// Create and configure the validator for your app
export function validateAppConfig(): ConfigValidator {
  const validator = new ConfigValidator();

  // Database
  validator.check("REDIS", true, "Redis connection string for data storage");

  // DigitalOcean Spaces Configuration
  validator.check("DO_SPACES_ENDPOINT", true, "DigitalOcean Spaces endpoint URL");
  validator.check("DO_SPACES_REGION", true, "DigitalOcean Spaces region");
  validator.check("DO_SPACES_KEY", true, "DigitalOcean Spaces access key");
  validator.check("DO_SPACES_SECRET", true, "DigitalOcean Spaces secret key");
  validator.check("DO_SPACES_BUCKET", true, "DigitalOcean Spaces bucket name");

  // Authentication
  validator.check("NEXT_PUBLIC_PASSWORD", true, "Admin login password");

  // Optional configurations
  validator.check("NODE_ENV", false, "Node environment");
  validator.check("VERCEL_URL", false, "Vercel deployment URL");

  return validator;
}
