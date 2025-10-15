import { useEffect, useRef } from 'react';
import { GetServerSideProps } from 'next';
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
      <MovieHomePage movies={movies} />
    </>
  );
}
