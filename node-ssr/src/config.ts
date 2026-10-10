import 'dotenv/config';

export const PORT = Number(process.env.PORT ?? 8080);
export const DOMAIN = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
export const ORIGIN = DOMAIN ? `https://${DOMAIN}` : `http://localhost:${PORT}`;
