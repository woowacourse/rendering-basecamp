import type { GetServerSidePropsContext } from "next/types";

export const extractCurrentUrlByRequest = (
  req: GetServerSidePropsContext["req"]
) => {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const url = req.url;
  return `${protocol}://${host}${url}`;
};
