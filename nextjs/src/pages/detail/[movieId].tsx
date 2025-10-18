import { moviesApi } from '@/api/movies';
import { MovieItem } from '@/types/Movie.types';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Home from '..';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';
import { MovieDetailResponse } from '@/types/MovieDetail.types';

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}> = async (context) => {
  const { movieId } = context.query;

  const [moviesResponse, movieDetailResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(Number(movieId)),
  ]);

  const movies = moviesResponse.data.results;
  const movieDetail = movieDetailResponse.data;
  return { props: { movies, movieDetail } };
};

export default function MovieDetail({
  movies,
  movieDetail,
}: {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();

  const onceRef = useRef(false);

  useEffect(() => {
    if (movieDetail == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(movieDetail);
    })();
  }, [movieDetail, openMovieDetailModal]);
  return (
    <>
      <Head>
        <title>{movieDetail.title}</title>
        <meta property="og:title" content={movieDetail.title} />
        <meta
          property="og:image"
          content={
            movieDetail.poster_path
              ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
              : ''
          }
        />
        <meta property="og:description" content={movieDetail.overview} />
        <meta
          property="og:url"
          content={`https://rendering-basecamp-s2k7.vercel.app/detail/${movieDetail.id}`}
        />
      </Head>
      <div id="wrap">
        <Home movies={movies} />
      </div>
    </>
  );
}
