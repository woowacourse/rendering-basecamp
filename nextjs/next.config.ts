import type { NextConfig } from 'next';

const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000';

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    env: {
        SITE_URL,
    },
};

export default nextConfig;
