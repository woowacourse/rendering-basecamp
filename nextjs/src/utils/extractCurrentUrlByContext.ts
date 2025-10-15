import type { GetServerSidePropsContext } from "next/types";

export const extractCurrentUrlByRequest = (
  req: GetServerSidePropsContext["req"]
) => {
  const host = req.headers.host;
  const url = req.url;
  return `${host}${url}`;
};
