import { CustomerPortfolio } from "@/components/platform/CustomerPortfolio";
import { Button } from "@/components/rydge/ui";
import { starterContent } from "@/lib/portfolio-content";

export const metadata = { title: "Explore the template — Forma", alternates: { canonical: "/template" } };

export default function TemplatePage() {
  return (
    <CustomerPortfolio
      content={starterContent}
      banner={<div className="float-banner">Live template preview <Button href="/register" variant="white">Make it yours</Button></div>}
    />
  );
}
