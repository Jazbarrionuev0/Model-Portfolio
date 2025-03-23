import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "500", "700"] });
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
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
