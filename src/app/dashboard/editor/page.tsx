import { ownedPortfolio } from "@/lib/accounts";
import { parseContent } from "@/lib/portfolio-content";
import { PlatformShell } from "@/components/platform/Chrome";
import { Editor } from "./Editor";
export const metadata = { title: "Portfolio editor — Forma", robots: { index: false, follow: false } };
export default async function EditorPage() { const portfolio = await ownedPortfolio(); return <PlatformShell><div className="editor-shell"><div className="platform-head"><div><p className="platform-kicker">Your portfolio / Editor</p><h1 className="platform-title">Make it yours.</h1></div></div><Editor initial={parseContent(portfolio.content)} slug={portfolio.slug} revision={portfolio.revision} /></div></PlatformShell>; }
