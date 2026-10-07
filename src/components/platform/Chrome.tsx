import Link from "next/link";

import { Interactions } from "@/components/editorial/Interactions";
import { Nav } from "@/components/editorial/Nav";

export const PLATFORM_NAV = [
  { label: "Template", href: "/template" },
  { label: "Demo", href: "/demo" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sign in", href: "/login" },
];

/** Account pages share the template's nav, type and footer. */
export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rx" id="top">
      <Interactions>
        <Nav brand="Forma" location="Portfolio platform" items={PLATFORM_NAV} icon={{ href: "/register", label: "Make it yours" }} />
        <main id="main" className="platform-main">{children}</main>
        <PlatformFooter />
      </Interactions>
    </div>
  );
}

export function PlatformFooter() {
  return (
    <footer className="platform-footer">
      <Link href="/" className="nav-logo">Forma<span>.</span></Link>
      <span>A considered home for creative work · ©{new Date().getUTCFullYear()}</span>
      <Link href="/register" className="link-inverse">Make it yours ↗</Link>
    </footer>
  );
}
