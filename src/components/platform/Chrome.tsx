import Link from "next/link";
export function PlatformHeader() {
 return <header className="platform-header"><Link href="/" className="platform-logo">forma<span>®</span></Link><nav aria-label="Platform"><Link href="/template">View template ↗</Link><Link href="/dashboard">My portfolio</Link></nav></header>;
}
export function PlatformFooter() { return <footer className="platform-footer"><Link href="/" className="platform-logo">forma®</Link><p>A considered home for creative work.</p><Link href="/register">Make it yours ↗</Link></footer>; }
