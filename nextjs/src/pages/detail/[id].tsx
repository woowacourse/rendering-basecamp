import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { moviesApi } from '@/api/movies';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { overlay } from 'overlay-kit';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';
import type { MovieItem } from '@/types/Movie.types';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { Footer } from '@/components/Footer';
import { MovieDetailModal } from '@/components/MovieDetailModal';

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
  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
    : 'https://rendering-basecamp-jurung.vercel.app/images/no_image.png';

  return (
    <>
      <Head>
        <title>{movieDetail.title} - 영화 추천 사이트</title>
        <meta name="description" content={movieDetail.overview} />

        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content={movieDetail.title} />
        <meta property="og:description" content={movieDetail.overview} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="영화 추천 사이트" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={movieDetail.title} />
        <meta name="twitter:description" content={movieDetail.overview} />
        <meta name="twitter:image" content={imageUrl} />
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
  const router = useRouter();
  const hasOpenedRef = useRef(false);
  const isDirectAccessRef = useRef(false);

  useEffect(() => {
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;

    isDirectAccessRef.current =
      !referrer || !referrer.startsWith(currentOrigin);
  }, []);

  useEffect(() => {
    if (hasOpenedRef.current) {
      return;
    }

    hasOpenedRef.current = true;

    overlay.open(({ unmount }) => {
      return (
        <MovieDetailModal
          movie={movieDetail}
          onClose={() => {
            unmount();
            if (isDirectAccessRef.current) {
              router.back();
            } else {
              router.push('/');
            }
          }}
        />
      );
    });
  }, [movieDetail, router]);

  return null;
}
