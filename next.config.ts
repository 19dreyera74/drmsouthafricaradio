import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "www.drm.org", pathname: "/wp-content/uploads/**" }],
  },
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      // Posts briefly lived at /news/<slug> before the Local/Global split.
      { source: "/news/:slug((?!local$|global$)[^/]+)", destination: "/news/local/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
