import { useEffect, useRef } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useMovieDetailModal } from '../../hooks/useMovieDetailModal';
import MovieHomePage from '../index';
import { moviesApi } from '../../api/movies';
import { MovieItem } from '../../types/Movie.types';
import { MovieDetailResponse } from '../../types/MovieDetail.types';

interface DetailProps {
  movies: MovieItem[];
  detail: MovieDetailResponse;
}

export const getServerSideProps: GetServerSideProps<DetailProps> = async ({ params }) => {
  try {
    const movieId = params?.id;
    const [movies, detail] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    return {
      props: {
        movies: movies.data.results,
        detail: detail.data,
      },
    };
  } catch (error) {
    console.error('영화 상세 정보를 불러오는데 실패했습니다:', error);
    return {
      notFound: true,
    };
  }
};

export default function MovieDetailPage({ movies, detail }: DetailProps) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (detail == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(detail);
    })();
  }, [detail, openMovieDetailModal]);

  return (
    <>
      <Head>
        <title>{detail.title} - Movie App</title>
        <meta property="og:title" content={detail.title} />
        <meta property="og:description" content={detail.overview} />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/w500${detail.poster_path}`}
        />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={detail.title} />
        <meta property="twitter:description" content={detail.overview} />
        <meta
          property="twitter:image"
          content={`https://image.tmdb.org/t/p/w500${detail.poster_path}`}
        />
      </Head>
      <MovieHomePage movies={movies} />
    </>
  );
}
