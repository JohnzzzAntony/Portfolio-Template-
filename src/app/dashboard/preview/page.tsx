import { ownedPortfolio } from "@/lib/accounts";
import { parseContent } from "@/lib/portfolio-content";
import { CustomerPortfolio } from "@/components/platform/CustomerPortfolio";
export const metadata = { title: "Private preview — Forma", robots: { index: false, follow: false } };
export default async function PreviewPage() { const portfolio = await ownedPortfolio(); return <CustomerPortfolio content={parseContent(portfolio.content)} preview />; }
