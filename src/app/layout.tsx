import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/fonts/fonts";

export const metadata: Metadata = {
  title: "Catalina Barrionuevo",
  description: "Catalina Barrionuevo - Fashion Model",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
