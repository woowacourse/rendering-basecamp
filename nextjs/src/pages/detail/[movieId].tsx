import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { moviesApi } from '@/api/movies';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';
import type { GetServerSideProps } from 'next';

interface DetailPageProps {
  movieDetail: MovieDetailResponse;
}

export default function DetailPageOpenModal({ movieDetail }: DetailPageProps) {
  const router = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      await openMovieDetailModal(movieDetail);
      // 모달이 닫히면 이전 페이지로 돌아가기
      router.back();
    })();
  }, [movieDetail, openMovieDetailModal, router]);

  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { movieId } = context.params!;

  try {
    const response = await moviesApi.getDetail(Number(movieId));
    return {
      props: {
        movieDetail: response.data,
      },
    };
  } catch (error) {
    console.error('Failed to fetch movie detail:', error);
    return {
      notFound: true,
    };
  }
};
