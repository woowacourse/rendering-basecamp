import { Request } from 'express';

export const getRequestUrl = (req: Request): string => {
  const protocol = req.protocol;
  const host = req.get('host');
  const currentUrl = `${protocol}://${host}${req.originalUrl}`;
  return currentUrl;
};
