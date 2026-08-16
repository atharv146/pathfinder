import type { Metadata } from "next";
import { Figtree, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { MotionProvider } from "@/components/MotionProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { Starfield } from "@/components/Starfield";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { IntroLoader } from "@/components/IntroLoader";
import { MotionToggle } from "@/components/MotionToggle";
import "./globals.css";

/**
 * Display face switched from Instrument Serif to Figtree (Aug 14, 2026).
 *
 * The editorial serif was the single largest reason the site read as a generic
 * template next to the user's references — Intrepid, Zypsy and Rejouice all
 * run a bold geometric sans. Figtree is the closest free match to that
 * register (Aeonik/Söhne family of shapes) and carries weight up to 900, which
 * is what makes the huge headline treatment work.
 */
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Kept only for rare italic accents; no longer the display face.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
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
      className={`${figtree.variable} ${ibmPlexMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-chalk">
        <IntroLoader />
        <MotionToggle />
        <Starfield />
        <CustomCursor />
        <ScrollProgress />
        <LanguageProvider>
        <MotionProvider>
          <SmoothScroll>
            <SiteNav />
            {children}
            <SiteFooter />
          </SmoothScroll>
        </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
