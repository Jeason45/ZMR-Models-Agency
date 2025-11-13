import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Augmenter la limite de taille des Server Actions
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
