import type { IncomingMessage } from "http";
import type { NextApiRequestCookies } from "next/dist/server/api-utils";

export function getAbsolutePageUrl({
  req,
  resolvedUrl,
}: {
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  };
  resolvedUrl: string;
}): string {
  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host;
  const pageUrl = new URL(resolvedUrl || "/", `${proto}://${host}`).toString();

  return pageUrl;
}
