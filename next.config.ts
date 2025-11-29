import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Output Configuration
   * "standalone" creates a minimal production build that includes only
   * the necessary dependencies. This is ideal for Docker deployments
   * as it results in smaller images and faster cold starts.
   */
  output: "standalone",

  /*
   * Experimental Features
   * typedRoutes: Enables TypeScript checking for Next.js route links
   * This catches broken links at compile time rather than runtime.
   */
  experimental: {
    typedRoutes: true,
  },

  /*
   * Image Optimization
   * Configure allowed image domains for next/image optimization.
   * Add external domains here if you need to serve optimized images
   * from remote sources (e.g., Supabase storage).
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "supabase.haugaard.dev",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default nextConfig;
