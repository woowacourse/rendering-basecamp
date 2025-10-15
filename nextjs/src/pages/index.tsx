import { moviesApi } from '@/api/movies';
import Meta from '@/components/common/Meta';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MovieList } from '@/components/MovieList';
import { MovieItem } from '@/types/Movie.types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export default function Home({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const title = `Movielist`;
  const description = '인기 있는 영화를 만나보세요!';
  const imageUrl = '/logo.png';
  const pageUrl = `https://rendering-basecamp-eosin.vercel.app/`;

  return (
    <>
      <Meta
        title={title}
        description={description}
        imageUrl={imageUrl}
        pageUrl={pageUrl}
      />
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps = (async () => {
  const response = await moviesApi.getPopular()
  const movies = response.data.results
  return { props: { movies } }
}) satisfies GetServerSideProps<{ movies: MovieItem[] }>