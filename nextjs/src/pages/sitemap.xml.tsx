import type { GetServerSideProps } from "next";
import { moviesApi } from "@/api/movies";
import { getSiteUrl } from "@/lib/siteUrl";

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
}[char]!));

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const siteUrl = getSiteUrl(req);

  try {
    const { data } = await moviesApi.getPopular();
    const urls = [`${siteUrl}/`, ...data.results.map((movie) => `${siteUrl}/detail/${movie.id}`)];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`).join("")}</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.write(sitemap);
  } catch {
    res.statusCode = 503;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("사이트맵을 불러올 수 없습니다.");
  }

  res.end();
  return { props: {} };
};

export default function Sitemap() { return null; }
