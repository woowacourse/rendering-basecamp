import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n: {
    locales: ["ko"],
    defaultLocale: "ko",
  },
};

export default nextConfig;
