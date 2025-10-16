import { moviesApi } from '@/api/movies';
import { MovieItem } from '@/types/Movie.types';
import { GetServerSideProps } from 'next';

export const getServerSideProps = (async ({ res }) => {
  let movies: MovieItem[] | null = null;
  try {
    const popularMovies = await moviesApi.getPopular();
    movies = popularMovies.data.results;
  } catch (error) {
    console.error('Failed to fetch popular movies for sitemap:', error);
  }

  const sitemap = generateMovieSitemapXml(movies || []);
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}) satisfies GetServerSideProps<{}>;

const wrapWithXmlStructure = (xmlContent: string) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      ${xmlContent}
    </urlset>
  `;
};

const getKoreanISODateTime = () => {
  const UTCTime = new Date();
  UTCTime.setHours(UTCTime.getHours() + 9);

  return UTCTime.toISOString();
};

const generateMovieSitemapXml = (movies: MovieItem[]) => {
  const BASE_URL = 'https://rendering-basecamp-nextjs.vercel.app/detail/';
  const lastMod = getKoreanISODateTime();
  const xmlContent = movies
    .map((movie) => movie.id)
    .map(
      (id) =>
        `
      <url>
        <loc>${BASE_URL}${id}</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
    `,
    )
    .join('');

  return wrapWithXmlStructure(xmlContent);
};

export default function Sitemap() {
  return null;
}
