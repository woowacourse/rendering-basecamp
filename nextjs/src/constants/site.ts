const productionHost = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = productionHost
  ? `https://${productionHost}`
  : 'http://localhost:3000';
