import type { NextConfig } from "next";

// Baseline security headers applied to every route.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // don't advertise the framework/version

  images: {
    // Project/service/blog media lives in Supabase Storage; allow next/image to
    // optimize it (AVIF/WebP + resizing) instead of shipping the originals.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000, // 30 days — these assets rarely change
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // hashed build assets are immutable — cache them hard
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // our own static files (logo, icons)
        source: "/:file(logo.png|icon-512.png)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
