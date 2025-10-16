import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { moviesApi } from '@/api/movies';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';
import type { MovieItem } from '@/types/Movie.types';
import Head from 'next/head';
import { HomeView } from '@/components/HomeView';
import { useEffect, useRef } from 'react';
import { useMovieDetailModal } from '@/hooks/useMovieDetailModal';

type Props = { movies: MovieItem[]; detail: MovieDetailResponse | null };

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const id = Number(params?.id);
  if (!id) return { notFound: true };

  try {
    const { data: popularData } = await moviesApi.getPopular(1);
    const { data: detailData } = await moviesApi.getDetail(id);

    const movies = popularData.results ?? [];
    const detail = detailData ?? null;

    return { props: { movies, detail } };
  } catch {
    return { props: { movies: [], detail: null } };
  }
};

export default function MovieDetailPage({
  movies,
  detail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (detail === null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(detail);
    })();
  }, [detail, openMovieDetailModal]);

  const imageUrl = detail?.poster_path
    ? `https://image.tmdb.org/t/p/original${detail?.poster_path}`
    : '/images/no_image.png';
  return (
    <>
      <Head>
        <meta property="og:title" content={detail?.original_title} />
        <meta property="og:description" content={detail?.overview} />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <HomeView movies={movies} />
    </>
  );
}
