import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useRef } from 'react';

import { moviesApi } from '../../api/movies';
import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import type { MovieItem } from '../../types/Movie.types';
import type { MovieDetailResponse } from '../../types/MovieDetail.types';
import MovieHomePage from '../index';

type DetailProps = {
  movies: MovieItem[];
  movie: MovieDetailResponse;
};

export const getServerSideProps: GetServerSideProps<DetailProps> = async ({
  params,
}) => {
  const movieId = Number(params?.movieId);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    return { notFound: true };
  }

  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  return {
    props: {
      movies: popularResponse.data.results,
      movie: detailResponse.data,
    },
  };
};

export default function MovieDetailPage({ movies, movie }: DetailProps) {
  return (
    <>
      <MovieHomePage movies={movies} />
      <Head>
        <title>{movie.title} - 영화 리뷰</title>
        <meta property="og:title" content={movie.title} key="og:title" />
        <meta
          property="og:description"
          content={movie.overview || '영화 상세 정보'}
          key="og:description"
        />
        {movie.poster_path && (
          <meta
            property="og:image"
            content={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
            key="og:image"
          />
        )}
      </Head>
      <DetailPageOpenModal movie={movie} />
    </>
  );
}

function DetailPageOpenModal({ movie }: { movie: MovieDetailResponse }) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) return;

    onceRef.current = true;
    void openMovieDetailModal(movie);
  }, [movie, openMovieDetailModal]);

  return null;
}
