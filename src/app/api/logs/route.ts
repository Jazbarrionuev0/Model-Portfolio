import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const limit = parseInt(searchParams.get("limit") || "100");
    const level = searchParams.get("level");
    const context = searchParams.get("context");
    const since = searchParams.get("since");
    const until = searchParams.get("until");

    // Don't log search operations to avoid recursive logging

    switch (action) {
      case "stats":
        const stats = await logger.getLogStats();
        return NextResponse.json(stats);

      case "contexts":
        const contexts = await logger.getAvailableContexts();
        return NextResponse.json({ contexts });

      case "errors":
        const errors = await logger.getRecentErrors(limit);
        return NextResponse.json({ logs: errors });

      case "filtered":
        const filters: {
          level?: number;
          context?: string;
          since?: string;
          until?: string;
        } = {};

        // Parse level filter
        if (level) {
          const levelNum = parseInt(level);
          if (!isNaN(levelNum) && levelNum >= 0 && levelNum <= 3) {
            filters.level = levelNum;
          }
        }

        // Parse context filter
        if (context) {
          filters.context = context;
        }

        // Parse date filters
        if (since) {
          try {
            new Date(since); // Validate date
            filters.since = since;
          } catch {
            return NextResponse.json({ error: "Invalid since date format" }, { status: 400 });
          }
        }

        if (until) {
          try {
            new Date(until); // Validate date
            filters.until = until;
          } catch {
            return NextResponse.json({ error: "Invalid until date format" }, { status: 400 });
          }
        }

        const filteredLogs = await logger.getLogs(limit, filters);
        return NextResponse.json({ logs: filteredLogs });

      case "level":
        if (!level) {
          return NextResponse.json({ error: "Level parameter required" }, { status: 400 });
        }
        const levelNum = parseInt(level);
        if (isNaN(levelNum) || levelNum < 0 || levelNum > 3) {
          return NextResponse.json({ error: "Invalid level. Use 0=DEBUG, 1=INFO, 2=WARN, 3=ERROR" }, { status: 400 });
        }
        const levelLogs = await logger.getLogsByLevel(levelNum, limit);
        return NextResponse.json({ logs: levelLogs });

      case "context":
        if (!context) {
          return NextResponse.json({ error: "Context parameter required" }, { status: 400 });
        }
        const contextLogs = await logger.getLogsByContext(context, limit);
        return NextResponse.json({ logs: contextLogs });

      case "clear":
        await logger.clearLogs();
        return NextResponse.json({ message: "Logs cleared successfully" });

      default:
        const allLogs = await logger.getLogs(limit);
        return NextResponse.json({ logs: allLogs });
    }
  } catch (error) {
    logger.error("Logs API error", "API", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    logger.info("Logs deletion requested", "API");
    await logger.clearLogs();
    return NextResponse.json({ message: "All logs cleared successfully" });
  } catch (error) {
    logger.error("Failed to clear logs", "API", error as Error);
    return NextResponse.json({ error: "Failed to clear logs" }, { status: 500 });
  }
}
