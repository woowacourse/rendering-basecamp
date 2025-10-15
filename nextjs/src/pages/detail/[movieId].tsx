import { moviesApi } from '@/api/movies';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from "next/head";
import { useRouter } from 'next/router';
import Home from '..';

export default function Detail({ movies, movieDetail }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : "/no_image.png";
  const pageUrl = `https://rendering-basecamp-eosin.vercel.app/detail/${movieDetail.id}`;
  const title = movieDetail.title;
  const description = movieDetail.overview || '영화 상세 정보';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:url" content={pageUrl} />
      </Head>
      <div id="wrap">
        <Home movies={movies} />
        <MovieDetailModal
          movie={movieDetail}
          onClose={() => {
            router.back();
          }}
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { movieId } = context.params as { movieId: string };
  const popularResponse = await moviesApi.getPopular()
  const detailResponse = await moviesApi.getDetail(Number(movieId));

  return {
    props: {
      movies: popularResponse.data.results,
      movieDetail: detailResponse.data,
    },
  };
};