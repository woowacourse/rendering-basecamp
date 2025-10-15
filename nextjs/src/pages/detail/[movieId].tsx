import { moviesApi } from '@/api/movies';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { MovieItem } from '@/types/Movie.types';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import { GetServerSideProps } from 'next';
import { useEffect, useRef } from 'react';
import MovieHomePage from '..';

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}> = async (ctx) => {
  const movieId = Number(ctx.params?.movieId);
  if (!movieId) return { notFound: true };

  try {
    const [popularRes, detailRes] = await Promise.all([
      moviesApi.getPopular(1),
      moviesApi.getDetail(movieId),
    ]);

    return {
      props: {
        movies: popularRes.data.results,
        movieDetail: detailRes.data,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

type MovieDetailPageProps = {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
};

export default function MovieDetailPage({
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  return (
    <>
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
    if (onceRef.current || !movieDetail) {
      return;
    }
    (async () => {
      onceRef.current = true;
      await openMovieDetailModal(movieDetail);
    })();
  }, [movieDetail, openMovieDetailModal]);

  return null;
}
