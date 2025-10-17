import { moviesApi } from '@/api/movies';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { MovieItem } from '@/types/Movie.types';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
}> = async () => {
  const data = await moviesApi.getPopular();
  const movies = data.data.results;
  return { props: { movies } };
};

export default function Home({ movies }: { movies: MovieItem[] }) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <meta
          property="og:url"
          content={`https://rendering-basecamp-s2k7.vercel.app/`}
        />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
