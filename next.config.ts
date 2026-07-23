import type { NextConfig } from "next";

/**
 * Static-export decision (spec 0.1): route (a).
 *
 * `output: 'export'` produces a fully static site. next/image optimisation is
 * disabled under export unless a custom loader is supplied, so we point the
 * loader at the Netlify Image CDN (/.netlify/images). See lib/image-loader.ts.
 *
 * This keeps the whole template deployable as static files while retaining
 * responsive image optimisation at request time on Netlify.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  // Export writes clean directory-style URLs (/about/ -> /about/index.html),
  // which is what Netlify's static hosting expects.
  trailingSlash: true,
};

export default nextConfig;
