import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Augmenter la limite de taille des body requests
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Configuration pour les API routes
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default nextConfig;
