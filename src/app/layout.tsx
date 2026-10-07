import type { Metadata } from "next";
import localFont from "next/font/local";

import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// Overused Grotesk (SIL OFL 1.1, see fonts/OverusedGrotesk-OFL.txt), bundled so
// builds never depend on a font CDN.
const grotesk = localFont({
  src: "./fonts/overused-grotesk-vf.woff2",
  variable: "--font-grotesk",
  display: "swap",
  weight: "300 900",
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: "Forma Portfolio", template: "%s" },
};

// Runs before first paint so scroll-revealed elements start hidden instead of
// flashing in and then disappearing when the interaction engine boots.
const markScripted = "document.documentElement.classList.add('js')";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={grotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: markScripted }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
