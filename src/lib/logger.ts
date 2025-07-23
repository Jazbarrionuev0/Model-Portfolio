/**
 * Enhanced logging system for production debugging
 */

import { getRedisClient } from "./database/redis";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel | string; // Allow both enum and string for Redis storage
  message: string;
  context?: string;
  data?: unknown;
  error?: Error | { name: string; message: string; stack?: string }; // Allow serialized error
  userId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private isProduction = process.env.NODE_ENV === "production";
  private maxLogsInRedis = 1000; // Keep last 1000 logs
  private logKey = "logs";

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = typeof entry.level === "number" ? LogLevel[entry.level] : entry.level;
    const context = entry.context ? `[${entry.context}]` : "";
    return `${timestamp} ${level} ${context} ${entry.message}`;
  }

  private async saveToRedis(entry: LogEntry): Promise<void> {
    try {
      const client = await getRedisClient();

      // Create a serializable log entry for Redis storage
      const redisLogEntry = {
        timestamp: entry.timestamp,
        level: typeof entry.level === "number" ? LogLevel[entry.level] : entry.level,
        message: entry.message,
        context: entry.context,
        ...(entry.data && typeof entry.data === "object" ? { data: entry.data } : {}),
        ...(entry.error && {
          error:
            entry.error instanceof Error
              ? {
                  name: entry.error.name,
                  message: entry.error.message,
                  stack: entry.error.stack,
                }
              : entry.error,
        }),
        ...(entry.userId && { userId: entry.userId }),
        ...(entry.requestId && { requestId: entry.requestId }),
      };

      // Add to Redis list (lPush adds to the beginning)
      await client.lPush(this.logKey, JSON.stringify(redisLogEntry));

      // Trim the list to keep only the last N logs (lTrim keeps elements from 0 to maxLogsInRedis-1)
      await client.lTrim(this.logKey, 0, this.maxLogsInRedis - 1);
    } catch (error) {
      // If Redis fails, we don't want to break the application
      // Just log to console that Redis logging failed
      if (this.isDevelopment) {
        console.error("Failed to save log to Redis:", error);
      }
    }
  }

  private async log(level: LogLevel, message: string, context?: string, data?: unknown, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      error,
    };

    // Save to Redis (don't await to avoid blocking)
    this.saveToRedis(entry).catch(() => {
      // Silently fail if Redis is unavailable
    });

    // Always log to console in development
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(entry);

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage, data);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, data);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, data);
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage, error || data);
          if (error) {
            console.error("Error stack:", error.stack);
          }
          break;
      }
    }

    // In production, use structured logging for better parsing
    if (this.isProduction) {
      const logData = {
        timestamp: entry.timestamp,
        level: LogLevel[level],
        message: entry.message,
        context: entry.context,
        ...(data && typeof data === "object" ? { data } : {}),
        ...(error && {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        }),
      };

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(JSON.stringify(logData));
          break;
        case LogLevel.INFO:
          console.info(JSON.stringify(logData));
          break;
        case LogLevel.WARN:
          console.warn(JSON.stringify(logData));
          break;
        case LogLevel.ERROR:
          console.error(JSON.stringify(logData));
          break;
      }
    }
  }

  debug(message: string, context?: string, data?: unknown) {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: unknown) {
    this.log(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: unknown) {
    this.log(LogLevel.WARN, message, context, data);
  }

  error(message: string, context?: string, error?: Error, data?: unknown) {
    this.log(LogLevel.ERROR, message, context, data, error);
  }

  // Specific logging methods for common scenarios
  apiRequest(method: string, url: string, userId?: string) {
    this.info(`${method} ${url}`, "API_REQUEST", { method, url, userId });
  }

  apiResponse(method: string, url: string, statusCode: number, duration?: number) {
    this.info(`${method} ${url} - ${statusCode}`, "API_RESPONSE", {
      method,
      url,
      statusCode,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  databaseQuery(operation: string, table: string, duration?: number) {
    this.debug(`${operation} on ${table}`, "DATABASE", {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  cacheOperation(operation: string, key: string, hit?: boolean) {
    this.debug(`Cache ${operation}: ${key}`, "CACHE", { operation, key, hit });
  }

  uploadOperation(filename: string, size?: number, bucket?: string) {
    this.info(`Upload: ${filename}`, "UPLOAD", { filename, size, bucket });
  }

  configCheck(key: string, hasValue: boolean, isRequired: boolean = false) {
    const level = isRequired && !hasValue ? LogLevel.ERROR : LogLevel.DEBUG;
    const message = `Config ${key}: ${hasValue ? "SET" : "MISSING"}${isRequired ? " (REQUIRED)" : ""}`;
    this.log(level, message, "CONFIG");
  }

  // Log retrieval methods with enhanced filtering
  async getLogs(
    limit: number = 100,
    filters?: {
      level?: LogLevel;
      context?: string;
      since?: string;
      until?: string;
    }
  ): Promise<LogEntry[]> {
    try {
      const client = await getRedisClient();
      // Get more logs for filtering, then limit after filtering
      const logs = await client.lRange(this.logKey, 0, this.maxLogsInRedis - 1);

      let parsedLogs = logs.map((logString) => {
        try {
          return JSON.parse(logString);
        } catch {
          // If parsing fails, return a basic log entry
          return {
            timestamp: new Date().toISOString(),
            level: LogLevel.ERROR,
            message: "Failed to parse log entry",
            context: "SYSTEM",
            data: { rawLog: logString },
          };
        }
      });

      // Apply filters
      if (filters) {
        if (filters.level !== undefined) {
          const levelName = LogLevel[filters.level];
          parsedLogs = parsedLogs.filter((log) => log.level === levelName);
        }

        if (filters.context) {
          parsedLogs = parsedLogs.filter((log) => log.context && log.context.toLowerCase().includes(filters.context!.toLowerCase()));
        }

        if (filters.since) {
          const sinceDate = new Date(filters.since);
          parsedLogs = parsedLogs.filter((log) => new Date(log.timestamp) >= sinceDate);
        }

        if (filters.until) {
          const untilDate = new Date(filters.until);
          parsedLogs = parsedLogs.filter((log) => new Date(log.timestamp) <= untilDate);
        }
      }

      return parsedLogs.slice(0, limit);
    } catch (error) {
      console.error("Failed to retrieve logs from Redis:", error);
      return [];
    }
  }

  async getLogsByLevel(level: LogLevel, limit: number = 100): Promise<LogEntry[]> {
    return this.getLogs(limit, { level });
  }

  async getLogsByContext(context: string, limit: number = 100): Promise<LogEntry[]> {
    return this.getLogs(limit, { context });
  }

  async getRecentErrors(limit: number = 50): Promise<LogEntry[]> {
    return this.getLogsByLevel(LogLevel.ERROR, limit);
  }

  async getAvailableContexts(): Promise<string[]> {
    const allLogs = await this.getLogs(this.maxLogsInRedis);
    const contexts = new Set<string>();

    allLogs.forEach((log) => {
      if (log.context) {
        contexts.add(log.context);
      }
    });

    return Array.from(contexts).sort();
  }

  async clearLogs(): Promise<void> {
    try {
      const client = await getRedisClient();
      await client.del(this.logKey);
      this.info("Logs cleared from Redis", "SYSTEM");
    } catch (error) {
      console.error("Failed to clear logs from Redis:", error);
    }
  }

  // Get log statistics
  async getLogStats(): Promise<{ total: number; byLevel: Record<string, number>; byContext: Record<string, number> }> {
    const allLogs = await this.getLogs(this.maxLogsInRedis);
    const byLevel: Record<string, number> = {};
    const byContext: Record<string, number> = {};

    allLogs.forEach((log) => {
      // Count by level
      byLevel[log.level] = (byLevel[log.level] || 0) + 1;

      // Count by context
      if (log.context) {
        byContext[log.context] = (byContext[log.context] || 0) + 1;
      }
    });

    return {
      total: allLogs.length,
      byLevel,
      byContext,
    };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, context?: string, data?: unknown) => logger.debug(message, context, data);

export const logInfo = (message: string, context?: string, data?: unknown) => logger.info(message, context, data);

export const logWarn = (message: string, context?: string, data?: unknown) => logger.warn(message, context, data);

export const logError = (message: string, context?: string, error?: Error, data?: unknown) => logger.error(message, context, error, data);
