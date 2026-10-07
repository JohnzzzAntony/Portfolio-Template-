import { ownedPortfolio } from "@/lib/accounts";
import { parseContent } from "@/lib/portfolio-content";
import { PlatformHeader } from "@/components/platform/Chrome";
import { Editor } from "./Editor";
export const metadata = { title: "Portfolio editor — Forma", robots: { index: false, follow: false } };
export default async function EditorPage() { const portfolio = await ownedPortfolio(); return <div className="platform"><PlatformHeader /><main className="editor-shell"><p className="platform-kicker">Your portfolio / Editor</p><h1>Make it yours.</h1><Editor initial={parseContent(portfolio.content)} slug={portfolio.slug} revision={portfolio.revision} /></main></div>; }
