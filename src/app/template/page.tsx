import Link from "next/link";
import { CustomerPortfolio } from "@/components/platform/CustomerPortfolio";
import { starterContent } from "@/lib/portfolio-content";
export const metadata = { title: "Explore the template — Forma", alternates: { canonical: "/template" } };
export default function TemplatePage() {
  return <><div className="preview-banner">Forma / Live template preview · <Link href="/register">Make it yours ↗</Link></div><CustomerPortfolio content={starterContent} /></>;
}
