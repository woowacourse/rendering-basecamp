import type { Request } from "express";

export const getCurrentUrlByRequest = (req: Request): string => {
  return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
};
