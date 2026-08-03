import type { Metadata } from "next";
import { Instrument_Serif, IBM_Plex_Mono, Inter } from "next/font/google";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

// High-contrast editorial serif — the display face in the wine-site and
// luxury-residence references, used for headlines only.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "PathFinder — College guidance for immigrant and first-gen students",
  description:
    "Free, student-owned college prep guidance for immigrant and first-generation students and their families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${ibmPlexMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-chalk">
        <MotionProvider>
          <SiteNav />
          {children}
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
