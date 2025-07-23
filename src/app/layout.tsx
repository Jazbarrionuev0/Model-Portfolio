import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { checkAppConfiguration, logEnvironmentInfo } from "@/lib/startup-config";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "500", "700"] });

export const metadata: Metadata = {
  title: "Catalina Barrionuevo",
  description: "Catalina Barrionuevo - Fashion Model",
};

// Run configuration check at module load time
if (typeof window === "undefined") {
  // Server-side only
  try {
    checkAppConfiguration();
    logEnvironmentInfo();
  } catch (error) {
    console.error("❌ Application startup failed:", error);
    // In production, you might want to exit the process
    if (process.env.NODE_ENV === "production") {
      console.error("Application cannot start due to configuration errors");
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
