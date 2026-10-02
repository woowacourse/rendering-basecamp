import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { isAxiosError } from 'axios';
import { MovieHome } from '../../components/MovieHome';
import { MovieDetailModal } from '../../components/MovieDetailModal';
import { moviesApi } from '../../api/movies';
import type { MovieItem } from '../../types/Movie.types';
import type { MovieDetailResponse } from '../../types/MovieDetail.types';

interface DetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

export const getServerSideProps: GetServerSideProps<
  DetailPageProps,
  { id: string }
> = async ({ params }) => {
  const movieId = Number(params?.id);
  if (!Number.isInteger(movieId)) {
    return { notFound: true };
  }

  try {
    const [popular, detail] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(movieId),
    ]);
    return {
      props: { movies: popular.data.results, movieDetail: detail.data },
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { notFound: true };
    }
    throw error;
  }
};

export default function DetailPage({ movies, movieDetail }: DetailPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <>
      <Head>
        <title>{`${movieDetail.title} | 영화 리뷰`}</title>
      </Head>
      <MovieHome movies={movies} />
      {isModalOpen && (
        <MovieDetailModal
          movie={movieDetail}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
