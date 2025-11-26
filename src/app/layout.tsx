// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen bg-cream dark:bg-dark-bg text-gray-900 dark:text-[#d4edda]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}