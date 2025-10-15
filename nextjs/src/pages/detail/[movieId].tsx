import { moviesApi } from '@/api/movies';
import { MovieItem } from '@/types/Movie.types';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Home from '..';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { useEffect } from 'react';
import { MovieDetailResponse } from '@/types/MovieDetail.types';

export const getServerSideProps: GetServerSideProps<{
  moviesDetail: MovieItem[];
  movieDetail: MovieDetailResponse;
}> = async (context) => {
  const { movieId } = context.query;
  const movies = await moviesApi.getPopular();
  const movie = await moviesApi.getDetail(Number(movieId));

  const moviesDetail = movies.data.results;
  const movieDetail = movie.data;
  return { props: { moviesDetail, movieDetail } };
};

export default function MovieDetail({
  moviesDetail,
  movieDetail,
}: {
  moviesDetail: MovieItem[];
  movieDetail: MovieDetailResponse;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    openMovieDetailModal(movieDetail);
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
          content={`https://rendering-basecamp-s2k7-git-minji2219-minji2219s-projects.vercel.app/detail/${movieDetail.id}`}
        />
      </Head>
      <div id="wrap">
        <Home movieDetail={moviesDetail} />
      </div>
    </>
  );
}
