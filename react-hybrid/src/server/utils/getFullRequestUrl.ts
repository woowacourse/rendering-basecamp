import { Request } from "express";

export function getFullRequestUrl(req: Request) {
  return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
}
