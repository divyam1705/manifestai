
import type { Metadata } from "next";
import { Raleway, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Manifest AI - Transform Your Dreams Into Reality",
  description: "AI-powered platform to manifest your goals and dreams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${raleway.variable} font-sans antialiased bg-[#0F172A] text-white`}>
        <div className="relative z-20">
          <Navbar />
        </div>
        {children}
      </body>
    </html>
  );
}
