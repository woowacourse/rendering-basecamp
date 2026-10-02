import type { IncomingMessage } from 'http';

export const getRequestOrigin = (request: IncomingMessage) => {
  const forwardedProtocol = request.headers['x-forwarded-proto'];
  const protocol =
    typeof forwardedProtocol === 'string'
      ? forwardedProtocol.split(',')[0]
      : 'http';

  return `${protocol}://${request.headers.host}`;
};
