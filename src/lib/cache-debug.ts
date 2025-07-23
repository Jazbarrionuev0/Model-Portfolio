/**
 * Cache debugging utilities
 */

export function logCacheInfo(actionName: string, data?: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[CACHE DEBUG] ${actionName}`, {
      timestamp: new Date().toISOString(),
      data: data ? (Array.isArray(data) ? `Array(${data.length})` : typeof data) : "undefined",
    });
  }
}

export function logRevalidation(paths: string[]) {
  if (process.env.NODE_ENV === "development") {
    console.log("[CACHE DEBUG] Revalidating paths:", {
      paths,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Add cache headers for debugging
 */
export function getCacheHeaders(maxAge: number = 0) {
  const headers = new Headers();

  if (process.env.NODE_ENV === "development") {
    headers.set("Cache-Control", `no-cache, no-store, must-revalidate, max-age=${maxAge}`);
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
  }

  return headers;
}
