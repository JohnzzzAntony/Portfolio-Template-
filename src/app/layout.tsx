import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

// Bundle the font so production builds work without a Google Fonts connection.
const grotesk = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-grotesk",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Forma Portfolio", template: "%s" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
