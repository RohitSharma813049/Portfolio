import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Premium Software Portfolio",
  description: "Deploy production-ready software on modern technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-white text-[#111111] antialiased`}>
        {/* We can add a global Navigation/Header here later */}
        {children}
      </body>
    </html>
  );
}
