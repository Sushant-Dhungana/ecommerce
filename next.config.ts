import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep type checking for your actual code
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
