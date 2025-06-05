import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',

  images: {
    unoptimized: true,
  },
  transpilePackages: ['@arcgis/core'],
};

export default nextConfig;