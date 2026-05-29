import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import LenisProvider from "@/components/providers/LenisProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Prime Interest Land Development",
    template: "%s | Prime Interest",
  },
  description:
    "Prime Interest Land Development — 46 developments across Georgia since 1990. Residential, commercial, student housing, and mixed-use projects throughout metro Atlanta and beyond.",
  keywords: [
    "real estate development",
    "land development",
    "Georgia",
    "Atlanta",
    "Buford",
    "Gwinnett",
    "residential",
    "commercial",
    "student housing",
    "Marty Orr",
    "Prime Interest",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Prime Interest Land Development",
    images: [{
      url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
      width: 1200,
      height: 630,
      alt: "Prime Interest Land Development — Georgia",
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[--color-bg] text-[--color-text]">
        <LenisProvider>{children}</LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
