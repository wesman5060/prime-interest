import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import StructuredData from "@/components/site/StructuredData";
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

// Update this once the production domain is finalized; sitemap.ts will follow.
const SITE_URL = "https://primeinterestinc.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "./" },
  title: {
    default: "Prime Interest, Inc. — Georgia Land Development Since 1990",
    template: "%s | Prime Interest",
  },
  description:
    "Prime Interest, Inc. — building Georgia's future since 1990. Developments across the state: residential, commercial, student housing, and mixed-use.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Prime Interest, Inc.",
    images: [{
      url: "/og.jpg",
      width: 1200,
      height: 630,
      alt: "Prime Interest, Inc. — Building Georgia's Future Since 1990",
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
      <body className="min-h-full flex flex-col bg-[color:var(--color-bg)] text-[color:var(--color-text)]">
        <StructuredData />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
