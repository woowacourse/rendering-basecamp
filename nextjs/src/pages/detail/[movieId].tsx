import { moviesApi } from "@/api/movies";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import Home from "@/pages";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type { MovieResponse } from "@/types/Movie.types";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";

interface Props {
  popularMovies: MovieResponse;
  movieDetail: MovieDetailResponse;
}

export const getServerSideProps = (async ({ params }) => {
  const movieId = Number(params?.movieId);
  if (Number.isNaN(movieId)) {
    return { notFound: true };
  }

  const [{ data: popularMovies }, { data: movieDetail }] = await Promise.all([
    moviesApi.getPopular(1),
    moviesApi.getDetail(movieId),
  ]);
  return { props: { popularMovies, movieDetail } };
}) satisfies GetServerSideProps<Props, { movieId: string }>;

export default function MovieDetailPage({ popularMovies, movieDetail }: Props) {
  const router = useRouter();
  const { title, overview, backdrop_path, poster_path } = movieDetail;
  const ogImagePath = backdrop_path ?? poster_path;

  return (
    <>
      <Home popularMovies={popularMovies} />
      <Head>
        <title>{`${title} | 영화 리뷰`}</title>
        <meta key="og:type" property="og:type" content="video.movie" />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:description" property="og:description" content={overview} />
        {ogImagePath && (
          <meta
            key="og:image"
            property="og:image"
            content={`https://image.tmdb.org/t/p/w1280${ogImagePath}`}
          />
        )}
      </Head>
      <MovieDetailModal movie={movieDetail} onClose={() => router.push("/")} />
    </>
  );
}
