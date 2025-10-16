import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { MovieDetailModalLoader } from '../components/MovieDetailModalLoader';
import { moviesApi } from '../api/movies';
import { MovieItem } from '../types/Movie.types';

interface HomePageProps {
  movies: MovieItem[];
}

export default function Home({ movies }: HomePageProps) {
  const router = useRouter();
  const { movieId } = router.query;

  const handleCloseModal = () => {
    router.push('/', undefined, { shallow: true });
  };

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>영화 리뷰 사이트</title>
        <meta name="description" content="인기 영화 리뷰를 확인하세요" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />

        {movieId && typeof movieId === 'string' && (
          <MovieDetailModalLoader
            movieId={Number(movieId)}
            close={handleCloseModal}
          />
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async () => {
  try {
    const movieResponse = await moviesApi.getPopular();
    const movies = movieResponse.data.results;

    return {
      props: {
        movies,
      },
    };
  } catch (error) {
    console.error('영화 데이터 페칭 실패:', error);

    return {
      props: {
        movies: [],
      },
    };
  }
};
