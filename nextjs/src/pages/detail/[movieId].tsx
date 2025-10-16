import { moviesApi } from '@/api/movies';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import Home from '..';
import { MovieItem } from '@/types/Movie.types';
import { MovieDetailResponse } from '@/types/MovieDetail.types';
import Head from 'next/head';

export default function Detail({
  movies,
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <meta property="og:title" content={movieDetail.title} key="title" />
        <meta property="og:description" content={movieDetail.overview} key="title" />
        <meta property="og:image" content={movieDetail.poster_path ?? ''} key="title" />
      </Head>
      <Home movies={movies} />
      <MovieDetailModal
        movie={movieDetail}
        onClose={() => {
          router.back();
        }}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}> = async (context) => {
  const { movieId } = context.params as { movieId: string };
  const popularResponse = await moviesApi.getPopular();
  const detailResponse = await moviesApi.getDetail(Number(movieId));

  return {
    props: {
      movies: popularResponse.data.results,
      movieDetail: detailResponse.data,
    },
  };
};
