import { moviesApi } from '@/api/movies';

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { MovieDetailModal } from '@/components/MovieDetailModal';

import Home from '@/pages/index';

// 상세 페이지의 getServerSideProps
export async function getServerSideProps({
  params,
}: GetServerSidePropsContext<{ movieId: string }>) {
  const movieId = params?.movieId;

  if (!movieId || !/^\d+$/.test(movieId)) {
    return { notFound: true };
  }

  const { data: movieData } = await moviesApi.getPopular();
  const { data: movieDetailData } = await moviesApi.getDetail(Number(movieId));

  return { props: { movies: movieData.results, movieDetail: movieDetailData } };
}

export default function MovieDetailPage({
  movies,
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  return (
    <>
      <Home movies={movies} />
      <MovieDetailModal
        movie={movieDetail}
        onClose={() => void router.push('/')}
      />
    </>
  );
}
