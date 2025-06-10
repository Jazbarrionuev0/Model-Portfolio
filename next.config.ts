import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // api: {
  //   bodyParser: {
  //     sizeLimit: "50mb",
  //   },
  // },
  env: {
    REDIS: process.env.REDIS,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "neopixel-images.nyc3.cdn.digitaloceanspaces.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "neopixel-images.nyc3.digitaloceanspaces.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
