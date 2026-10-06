import type { GetServerSideProps } from "next";
import { moviesApi } from "@/api/movies";
import type { MovieItem } from "@/types/Movie.types";

const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL;

function generateSiteMap(movies: MovieItem[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
  </url>
  ${movies
    .map(
      ({ id }) => `<url>
    <loc>${SITE_URL}/detail/${id}</loc>
  </url>`,
    )
    .join("\n  ")}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // 현재 홈에 표시되는 인기 영화 첫 페이지를 사이트맵에 포함한다.
  const { data } = await moviesApi.getPopular();
  const sitemap = generateSiteMap(data.results);

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function SiteMap() {
  return null;
}
