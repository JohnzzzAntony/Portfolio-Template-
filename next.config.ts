import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this, Turbopack walks up and finds the
  // package-lock.json in the user's home directory and warns about it.
  turbopack: { root: path.resolve(__dirname) },

  // Images come from the CMS as arbitrary URLs (local uploads under /media, or
  // whatever remote host an editor pastes in), so they render through plain
  // <img>. next/image would need an allowlist the editor can't extend.
  experimental: {
    serverActions: {
      // Media uploads are capped at 8 MB in the action; leave headroom.
      bodySizeLimit: "10mb",
    },
  },

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        // Uploaded files are user-supplied. Force a download-safe content type
        // so an SVG can't execute script in the site's own origin.
        source: "/media/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Content-Security-Policy", value: "sandbox" },
        ],
      },
    ];
  },
};

export default nextConfig;
