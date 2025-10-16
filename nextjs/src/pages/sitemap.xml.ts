import { GetServerSideProps } from 'next';
import { moviesApi } from '@/api/movies';
import type { MovieItem } from '@/types/Movie.types';

const BASE_URL = 'https://rendering-basecamp-levi.vercel.app';

function generateSiteMap(movies: MovieItem[]) {
  const currentDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${BASE_URL}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     ${movies
       .map((movie) => {
         return `
     <url>
       <loc>${BASE_URL}/detail/${movie.id}</loc>
       <lastmod>${currentDate}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>`;
       })
       .join('')}
   </urlset>
 `;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const movieResponse = await moviesApi.getPopular(1);
    const movies = movieResponse.data.results;
    const sitemap = generateSiteMap(movies);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    res.statusCode = 500;
    res.end();
  }

  return {
    props: {},
  };
};

export default function SiteMap() {
  return null;
}
