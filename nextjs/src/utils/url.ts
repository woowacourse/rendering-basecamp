import type { IncomingMessage } from 'http';

/**
 * 요청 헤더로 현재 사이트의 origin(프로토콜 + 호스트)을 구한다.
 * Vercel 같은 프록시 뒤에서는 x-forwarded-proto로 실제 프로토콜을 알 수 있다.
 */
export const getOrigin = (req: IncomingMessage) => {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol =
    (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) ??
    'http';
  return `${protocol}://${req.headers.host}`;
};
