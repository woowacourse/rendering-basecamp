import { moviesApi } from '@/api/movies';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { useRouter } from 'next/router';
import { useRef, useEffect } from 'react';
import Head from 'next/head';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';

export const getServerSideProps = (async (context) => {
  const { id } = context.params as { id: string };

  try {
    const movieDetailResponse = await moviesApi.getDetail(Number(id));
    const movieDetail = movieDetailResponse.data;

    return {
      props: {
        movieDetail,
      },
    };
  } catch (error) {
    console.error('Failed to fetch movie data:', error);
    return {
      notFound: true,
    };
  }
}) satisfies GetServerSideProps<{
  movieDetail: MovieDetailResponse;
}>;

export default function MovieDetailPage() {
  return (
    <>
      <MovieHomePage />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const { query } = useRouter();
  const id = query?.id;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (id == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(id));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [id, openMovieDetailModal]);

  return null;
}
