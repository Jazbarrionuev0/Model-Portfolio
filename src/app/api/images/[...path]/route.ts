import { NextResponse } from "next/server";
import { join } from "path";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  try {
    const pathArray = Array.isArray(path) ? path : [path];
    const imagePath = pathArray.join("/");
    const filePath = join(process.cwd(), "public/uploads", imagePath);

    if (!existsSync(filePath)) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const contentType = getContentType(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Error serving image", { status: 500 });
  }
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return types[ext] || "application/octet-stream";
}
