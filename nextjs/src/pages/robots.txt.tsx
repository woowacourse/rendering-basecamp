import type { GetServerSideProps } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const siteUrl = getSiteUrl(req);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  res.end();
  return { props: {} };
};

export default function Robots() { return null; }
