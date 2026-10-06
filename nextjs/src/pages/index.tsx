import Head from "next/head";

import { moviesApi } from "../api/movies";
import { MovieItem } from "../types/Movie.types";

import { GetStaticProps, InferGetStaticPropsType } from "next";
import { usePopularMovies } from "@/hooks/queries/usePopularMovies";

import HomeView from "../components/HomeView";

export const getStaticProps = (async () => {
  const movieDetail = await moviesApi.getPopular();
  const movies: MovieItem[] = movieDetail.data.results;
  return { props: { movies }, revalidate: 60 * 60 * 24 };
}) satisfies GetStaticProps<{
  movies: MovieItem[];
}>;

const APP_NAME = "Movielist";

const productionDomain = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = `https://${productionDomain}`;

export default function Home({
  movies: initialMovies,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: movies } = usePopularMovies({ initialMovies });
  if (!movies) return;

  const movieTitles = movies.map((movie) => movie.title).join(" / ");

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content="지금 인기 있는 영화를 확인해보세요" />

        <meta property="og:title" content={`${movieTitles} - ${APP_NAME}`} />
        <meta property="og:description" content={movieTitles} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="video.movie" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="wrap">
        <HomeView movies={movies} />
      </div>
    </>
  );
}
