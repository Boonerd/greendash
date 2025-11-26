import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import ApplyDarkMode from "./apply-dark-mode";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = { /* your metadata */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-cream text-gray-900`}>
        <ApplyDarkMode />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}