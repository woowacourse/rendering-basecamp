import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useRef } from "react";
import MovieHomePage from "../index";
import { moviesApi } from "../../api/movies";
import { useMovieDetailModal } from "../../hooks/useMovieDetailModal";
import type { MovieItem } from "../../types/Movie.types";
import type { MovieDetailResponse } from "../../types/MovieDetail.types";

interface Props {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
  pageUrl: string;
}

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

const getOgImageUrl = (movie: MovieDetailResponse) => {
  if (movie.backdrop_path)
    return `${TMDB_IMAGE_URL}/w780${movie.backdrop_path}`;
  if (movie.poster_path) return `${TMDB_IMAGE_URL}/w500${movie.poster_path}`;
  return null;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  req,
  resolvedUrl,
}) => {
  const id = Number(params?.id);

  const [popular, detail] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(id),
  ]);

  return {
    props: {
      movies: popular.data.results,
      movieDetail: detail.data,
      pageUrl: `https://${req.headers.host}${resolvedUrl}`,
    },
  };
};

export default function MovieDetailPage({
  movies,
  movieDetail,
  pageUrl,
}: Props) {
  const title = `${movieDetail.title} | Movielist`;
  const description =
    movieDetail.overview || `${movieDetail.title}의 상세 정보를 확인해 보세요.`;
  const ogImageUrl = getOgImageUrl(movieDetail);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Movielist" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

function DetailPageOpenModal({
  movieDetail,
}: {
  movieDetail: MovieDetailResponse;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;
    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}
