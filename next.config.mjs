/** @type {import('next').NextConfig} */

// Two deploy targets share this config:
//  - Hugging Face Space (Docker): a long-running Node server -> `standalone`.
//  - GitHub Pages (static host): a pure static export -> `export`, enabled by
//    setting STATIC_EXPORT=1 (the CI does this).
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  output: isStaticExport ? "export" : "standalone",
  reactStrictMode: true,
  // GitHub Pages serves <path>/index.html; trailing slashes make nested routes
  // resolve without a server rewrite. Harmless but unnecessary on the Space.
  trailingSlash: isStaticExport,
  // App icons / community Space thumbnails come from arbitrary HF hosts; we
  // render them with plain <img> (no next/image optimizer). `unoptimized` is
  // also required for `output: export`, so we set it unconditionally.
  images: { unoptimized: true },
};

export default nextConfig;
