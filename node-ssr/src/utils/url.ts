import { Request } from "express";

export function getCanonicalUrl(req: Request, fallbackHost: string): string {
  const forwarded = req.headers["x-forwarded-proto"]; // for proxies
  const protocol = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded || req.protocol;
  const host = req.headers.host || fallbackHost;
  return `${protocol}://${host}${req.originalUrl}`;
}
