/**
 * Development cache status checker
 * Add this to any page to debug cache issues
 */

import { headers } from "next/headers";

export async function CacheStatus() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "Unknown";
  const cacheControl = headersList.get("cache-control");

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded text-xs z-50 max-w-sm">
      <div className="font-bold mb-1">Cache Debug Info</div>
      <div>Time: {new Date().toLocaleTimeString()}</div>
      <div>Cache-Control: {cacheControl || "None"}</div>
      <div>User-Agent: {userAgent.slice(0, 50)}...</div>
    </div>
  );
}
