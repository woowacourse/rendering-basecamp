import { Request } from "express";

export const getUrl = (req: Request): string => {
  return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
};
