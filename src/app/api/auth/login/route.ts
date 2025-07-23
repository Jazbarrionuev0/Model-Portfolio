import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    logger.info("Login attempt", "AUTH", {
      hasPassword: !!password,
      userAgent: request.headers.get("user-agent")?.slice(0, 100),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    });

    if (!password) {
      logger.warn("Login attempt with missing password", "AUTH");
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const expectedPassword = process.env.NEXT_PUBLIC_PASSWORD;

    if (!expectedPassword) {
      logger.error("NEXT_PUBLIC_PASSWORD environment variable not set", "AUTH");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Compare password with expected value
    if (password === expectedPassword) {
      // Create a secure session token
      const sessionToken = await bcrypt.hash(password + Date.now(), 10);

      logger.info("Successful login", "AUTH");

      return NextResponse.json({ token: sessionToken }, { status: 200 });
    } else {
      logger.warn("Failed login attempt - incorrect password", "AUTH");
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    logger.error("Login error", "AUTH", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
