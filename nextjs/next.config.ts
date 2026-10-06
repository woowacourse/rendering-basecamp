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
    // next/image로 TMDB 이미지를 최적화하기 위해 외부 도메인 허용
    images: {
        remotePatterns: [{ protocol: 'https', hostname: 'image.tmdb.org', pathname: '/t/p/**' }],
    },
};

export default nextConfig;
