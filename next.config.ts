import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
    optimizeCss: true,
  },
    compiler: {
    // modern browsers target
  },
  transpilePackages: [],

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;