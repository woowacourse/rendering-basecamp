import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { moviesApi } from '@/api/movies';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';
import type { MovieItem } from '@/types/Movie.types';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { Footer } from '@/components/Footer';

export const getServerSideProps = (async (context) => {
  const { id } = context.params as { id: string };

  try {
    const [movieDetailResponse, moviesResponse] = await Promise.all([
      moviesApi.getDetail(Number(id)),
      moviesApi.getPopular(),
    ]);

    const movieDetail = movieDetailResponse.data;
    const movies = moviesResponse.data.results;

    return {
      props: {
        movieDetail,
        movies,
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
  movies: MovieItem[];
}>;

export default function MovieDetailPage({
  movieDetail,
  movies,
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
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
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
  const router = useRouter();
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (hasOpenedRef.current) {
      return;
    }

    hasOpenedRef.current = true;

    openMovieDetailModal(movieDetail).then(() => {
      // 모달이 닫히면 메인 페이지로 이동
      router.push('/');
    });
  }, [movieDetail, openMovieDetailModal, router]);

  return null;
}
