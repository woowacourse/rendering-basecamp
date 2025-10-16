import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { Footer } from '@/components/Footer';
import { moviesApi } from '@/api/movies';
import type { MovieItem } from '@/types/Movie.types';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
}> = async () => {
  try {
    const { data } = await moviesApi.getPopular(1);
    const movies = data.results;
    return { props: { movies } };
  } catch {
    return { props: { movies: [] } };
  }
};

export default function MovieHomePage({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(movies);
  if (!movies || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const imageUrl = movies[0]?.poster_path
    ? `https://image.tmdb.org/t/p/original${movies[0]?.poster_path}`
    : '/images/no_image.png';

  return (
    <div id="wrap">
      <Head>
        <meta property="og:title" content="MovieList" />
        <meta
          property="og:description"
          content="현재 인기 영화 목록을 확인해볼 수 있습니다!"
        />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
