import { Request } from "express";

function extractURL(request: Request) {
  const protocol = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers.host;
  const fullUrl = `${protocol}://${host}${request.originalUrl}`;

  return fullUrl;
}

export default extractURL;
