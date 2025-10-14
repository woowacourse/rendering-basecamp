import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/detail/:movieId",
        destination: "/?movieId=:movieId",
      },
    ];
  },
};

export default nextConfig;
