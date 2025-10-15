import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { moviesApi } from '@/api/movies';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
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

export default function MovieDetailPage({
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{movieDetail.title} - 영화 추천 사이트</title>
        <meta name="description" content={movieDetail.overview} />

        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content={movieDetail.title} />
        <meta property="og:description" content={movieDetail.overview} />
        <meta property="og:site_name" content="영화 추천 사이트" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={movieDetail.title} />
        <meta name="twitter:description" content={movieDetail.overview} />
      </Head>
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
    if (onceRef.current === true) {
      return;
    }
    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}
