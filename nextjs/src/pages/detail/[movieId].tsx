import { moviesApi } from '@/api/movies';

import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { MovieDetailModal } from '@/components/MovieDetailModal';

import Home from '@/pages/index';
import Head from 'next/head';

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

  // 메타데이터 구성
  const siteUrl = 'https://rendering-basecamp-jet.vercel.app/';
  const title = `${movieDetail.title} | Movielist`;
  const description =
    movieDetail.overview.trim() ||
    `[${movieDetail.title}] 영화의 상세정보를 확인하세요.`;

  const detailUrl = `${siteUrl}/detail/${movieDetail.id}`;

  const imageUrl = `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} key="description" />
        <link rel="canonical" href={detailUrl} key="canonical" />

        <meta property="og:title" content={title} key="og:title" />
        <meta
          property="og:description"
          content={description}
          key="og:description"
        />
        <meta property="og:image" content={imageUrl} key="og:image" />
        <meta property="og:url" content={detailUrl} key="og:url" />
      </Head>
      <Home movies={movies} />
      <MovieDetailModal
        movie={movieDetail}
        onClose={() => void router.push('/')}
      />
    </>
  );
}
