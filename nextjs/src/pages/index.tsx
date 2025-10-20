import Head from 'next/head';

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { Footer } from '@/components/Footer';
import { moviesApi } from '@/api/movies';
import type { MovieItem } from '@/types/Movie.types';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import { useRouter } from 'next/router';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { useEffect, useRef } from 'react';

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
}> = async () => {
  try {
    const response = await moviesApi.getPopular(1);

    return {
      props: {
        movies: response.data.results,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default function MovieHomePage({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;

    const queryValue = router.query.movieId;
    const movieIdParam = Array.isArray(queryValue) ? queryValue[0] : queryValue;
    const movieId = movieIdParam ? Number(movieIdParam) : NaN;
    if (!movieId) return;

    let cancelled = false;

    const openModal = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        const { data } = await moviesApi.getDetail(movieId);
        if (cancelled) return;
        await openMovieDetailModal(data as MovieDetailResponse);
      } catch (error) {
        console.error('모달 열기 실패', error);
        if (!cancelled) {
          router.replace('/', undefined, { shallow: true });
        }
      } finally {
        isFetchingRef.current = false;
      }
    };

    openModal();
    return () => {
      cancelled = true;
    };
  }, [openMovieDetailModal, router, router.isReady, router.query.movieId]);

  return (
    <>
      <Head>
        <title>기린의 영화 리뷰 사이트</title>
        <meta name='description' content='영화 목록' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='google-site-verification'
          content='svRRSyuqs46NE4VOZsQ0QyUG7CjnqFI5WMIOe1_cJmc'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div id='wrap'>
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
