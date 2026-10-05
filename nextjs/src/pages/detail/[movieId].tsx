import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import MovieHomePage from '../index';
import { moviesApi } from '../../api/movies';
import type { MovieItem } from '../../types/Movie.types';
import type { MovieDetailResponse } from '../../types/MovieDetail.types';

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
  pageUrl: string;
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps,
  { movieId: string }
> = async ({ params, req }) => {
  const movieId = Number(params?.movieId);

  if (!Number.isInteger(movieId)) {
    return { notFound: true };
  }

  const [popularResult, detailResult] = await Promise.allSettled([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  if (detailResult.status === 'rejected') {
    return { notFound: true };
  }

  const protocol = req.headers['x-forwarded-proto'] ?? 'http';
  const pageUrl = `${protocol}://${req.headers.host}/detail/${movieId}`;

  return {
    props: {
      movies:
        popularResult.status === 'fulfilled'
          ? popularResult.value.data.results
          : [],
      movieDetail: detailResult.value.data,
      pageUrl,
    },
  };
};

export default function MovieDetailPage({
  movies,
  movieDetail,
  pageUrl,
}: MovieDetailPageProps) {
  return (
    <>
      <MovieDetailHead movieDetail={movieDetail} pageUrl={pageUrl} />
      <MovieHomePage movies={movies} />
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

function MovieDetailHead({
  movieDetail,
  pageUrl,
}: {
  movieDetail: MovieDetailResponse;
  pageUrl: string;
}) {
  const { title, overview, backdrop_path, poster_path } = movieDetail;
  const description = overview || `${title}의 상세 정보를 확인해보세요.`;
  const imageUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${backdrop_path}`
    : poster_path
      ? `https://image.tmdb.org/t/p/w500${poster_path}`
      : null;

  return (
    <Head>
      <title>{`${title} | 영화 리뷰`}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="video.movie" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
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
    if (onceRef.current === true) {
      return;
    }
    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}
