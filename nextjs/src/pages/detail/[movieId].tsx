import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { moviesApi } from '@/api/movies';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';

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
      router.back();
    })();
  }, [movieDetail, openMovieDetailModal, router]);

  console.log(movieDetail.poster_path);

  const ogImage = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : '/images/no_image.png';

  return (
    <>
      <Head>
        <title>{movieDetail.title} | 영화 상세</title>
        <meta
          name="description"
          content={movieDetail.overview || '영화 상세 정보'}
        />
        <meta
          property="og:title"
          content={`${movieDetail.title} | 영화 상세`}
        />
        <meta
          property="og:description"
          content={movieDetail.overview || '영화 상세 정보'}
        />
        <meta property="og:image" content={ogImage} />
        <meta
          property="og:url"
          content={`https://rendering-basecamp-alpha.vercel.app/detail/${movieDetail.id}`}
        />
        <meta property="og:type" content="video.movie" />
      </Head>
    </>
  );
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
