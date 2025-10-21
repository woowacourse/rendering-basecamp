import { Request } from "express";

export const getFullRequestUrl = (req: Request) => {
  return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
};
