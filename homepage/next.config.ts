import type { NextConfig } from "next";
import { resolve } from "node:path";

/** 与构建脚本共享的部署前缀：SITE_BASE=/my-repo 时站点落在子路径下。 */
const siteBase = (process.env.SITE_BASE ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  turbopack: { root: resolve(__dirname, "..") },
  output: "export",
  // Chunks are requested from <base>/docs/_home/_next/; build-site.mjs moves out/_next there.
  assetPrefix: `${siteBase}/docs/_home`,
  // Inline the prefix so client components can build links without process.env.
  env: { NEXT_PUBLIC_SITE_BASE: siteBase },
  trailingSlash: true,
  images: {
    // Static export: every image is a local file under /docs/_home and is served as-is.
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
