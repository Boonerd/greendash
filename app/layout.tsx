import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "GreenDash - Shamba Smart",
  description: "Precision agriculture dashboard for Kenyan farmers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-cream text-forest-dark dark:bg-forest-dark dark:text-cream transition-colors duration-300 antialiased selection:bg-lime selection:text-white`}>
        {children}
      </body>
    </html>
  );
}