import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";

import { moviesApi } from "@/api/movies";

import { usePopularMovies } from "@/hooks/queries/usePopularMovies";
import { useMovieDetail } from "@/hooks/queries/useMovieDetail";

import { MovieDetailModal } from "@/components/MovieDetailModal";

import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";

import HomeView from "@/components/HomeView";
import { useRouter } from "next/router";

export const getStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = (async ({ params }) => {
  if (!params) return { notFound: true };

  const movieId = params.id;

  const [moviesData, movieDetail] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(movieId)),
  ]);

  const movies: MovieItem[] = moviesData.data.results;

  return {
    props: {
      movies,
      movie: movieDetail.data,
    },
    revalidate: 60 * 60 * 24,
  };
}) satisfies GetStaticProps<{
  movies: MovieItem[];
  movie: MovieDetailResponse;
}>;

const APP_NAME = "Movielist";

const productionDomain = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = `https://${productionDomain}`;

export default function MovieDetail({
  movies: initialMovies,
  movie: initialMovie,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  const { data: movies } = usePopularMovies({ initialMovies });
  const { data: movie } = useMovieDetail({ initialMovie });

  const imageUrl = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie?.backdrop_path}`
    : `https://image.tmdb.org/t/p/w780${movie?.poster_path}`;

  return (
    <>
      <Head>
        <title>
          {movie?.title} - {APP_NAME}
        </title>
        <meta
          name="description"
          content={`${movie?.overview} - ${movie?.title}`}
        />

        <meta property="og:title" content={`${movie?.title} - ${APP_NAME}`} />
        <meta property="og:description" content={movie?.overview} />
        {movie?.poster_path && <meta property="og:image" content={imageUrl} />}
        <meta property="og:image:alt" content={`${movie?.title} 대표 이미지`} />
        <meta property="og:url" content={`${siteUrl}/detail/${movie?.id}`} />
        <meta property="og:type" content="video.movie" />

        <meta name="twitter:card" content="summary_large_image" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeView movies={movies} />
      {movie && (
        <MovieDetailModal
          movie={movie}
          onClose={() => {
            router.push("/");
          }}
        />
      )}
    </>
  );
}
