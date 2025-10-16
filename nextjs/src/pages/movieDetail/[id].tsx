import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import MovieHomePage from '../index';
import { moviesApi } from '@/api/movies';
import type { MovieDetailResponse } from '@/types/MovieDetail.types';
import type { MovieItem } from '@/types/Movie.types';
import Head from 'next/head';

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
  const imageUrl = detail?.poster_path
    ? `https://image.tmdb.org/t/p/original${detail?.poster_path}`
    : '/images/no_image.png';

  return (
    <>
      <Head>
        <meta property="og:title" content="MovieList" />
        <meta
          property="og:description"
          content="현재 인기 영화 목록을 확인해볼 수 있습니다!"
        />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <MovieHomePage movies={movies} />
    </>
  );
}
