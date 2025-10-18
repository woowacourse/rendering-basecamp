import { Request } from "express";

export const getFullUrl = (req: Request): string => {
  return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
};
