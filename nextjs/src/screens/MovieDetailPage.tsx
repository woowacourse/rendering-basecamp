import Head from "next/head";
import { useRouter } from "next/router";
import type { MovieItem } from "../types/Movie.types";
import type { MovieDetailResponse } from "../types/MovieDetail.types";
import { MovieDetailModal } from "../components/MovieDetailModal";
import MovieHomePage from "./MovieHomePage";

const SITE_URL = "https://rendering-basecamp-nextjs-eosin.vercel.app";

export type MovieDetailPageProps = {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
};

export default function MovieDetailPage({
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  const router = useRouter();
  const description =
    movieDetail.overview || `${movieDetail.title}의 영화 정보와 리뷰를 확인하세요.`;
  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
    : `${SITE_URL}/images/no_image.png`;

  return (
    <>
      <Head>
        <title>{`${movieDetail.title} | 영화 리뷰`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={movieDetail.title} key="og:title" />
        <meta property="og:description" content={description} key="og:description" />
        <meta property="og:type" content="video.movie" key="og:type" />
        <meta
          property="og:url"
          content={`${SITE_URL}/detail/${movieDetail.id}`}
          key="og:url"
        />
        <meta property="og:image" content={imageUrl} key="og:image" />
      </Head>
      <MovieHomePage movies={movies} />
      <MovieDetailModal
        movie={movieDetail}
        onClose={() => void router.push("/")}
      />
    </>
  );
}
