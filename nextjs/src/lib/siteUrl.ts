import type { IncomingMessage } from "node:http";

export const getSiteUrl = (req: IncomingMessage) => {
  const configuredUrl = process.env.SITE_URL;
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

  if (configuredUrl) return new URL(configuredUrl).origin;
  if (vercelHost) return `https://${vercelHost}`;

  // 로컬 실행 시에도 OG 이미지와 canonical URL을 절대 주소로 만듭니다.
  const host = req.headers.host || "localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1")
    ? "http"
    : "https";
  return `${protocol}://${host}`;
};
