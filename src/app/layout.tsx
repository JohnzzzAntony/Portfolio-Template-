import type { Metadata } from "next";
import localFont from "next/font/local";

import { siteUrl } from "@/lib/site-url";
import "./globals.css";
import "./portfolio-assets.css";

// Manrope (SIL OFL 1.1, see fonts/Manrope-OFL.txt), the brand book's only typeface;
// bundled so builds never depend on a font CDN.
const manrope = localFont({
  src: "./fonts/manrope-vf.woff2",
  variable: "--font-brand",
  display: "swap",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: "Johns Antony", template: "%s" },
};

// Runs before first paint so scroll-revealed elements start hidden instead of
// flashing in and then disappearing when the interaction engine boots.
const markScripted = "document.documentElement.classList.add('js')";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: markScripted }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
