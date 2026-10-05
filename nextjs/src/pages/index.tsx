import type { GetServerSideProps } from "next";
import Head from "next/head";
import { MovieHome } from "../components/MovieHome";
import { moviesApi } from "../api/movies";
import { CDN_CACHE_CONTROL } from "../constants/cache";
import type { MovieItem } from "../types/Movie.types";

interface Props {
  movies: MovieItem[];
  pageUrl: string;
}

const TITLE = "Movielist";
const DESCRIPTION = "지금 인기 있는 영화를 확인해 보세요.";

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const movies = await moviesApi
    .getPopular()
    .then((response) => response.data.results)
    .catch(() => []);

  // 조회 실패로 빈 목록일 때는 캐싱하지 않는다
  if (movies.length > 0) {
    res.setHeader("Cache-Control", CDN_CACHE_CONTROL);
  }

  return {
    props: {
      movies,
      pageUrl: `https://${req.headers.host}/`,
    },
  };
};

export default function MovieHomePage({ movies, pageUrl }: Props) {
  const featuredBackdropPath = movies[0]?.backdrop_path;
  const ogImageUrl = featuredBackdropPath
    ? `https://image.tmdb.org/t/p/w780${featuredBackdropPath}`
    : null;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Movielist" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={pageUrl} />
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <MovieHome movies={movies} preloadBackground />
    </>
  );
}
