import { NextConfig } from "next";

// Next.js configuration (compatible with Next 14+ and Turbopack)
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "", 
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  transpilePackages: ["@react-pdf/renderer"],
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      process: false,
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Removed "standalone" output that was causing the build error
  serverExternalPackages: ['@supabase/ssr'],
};

export default nextConfig;
