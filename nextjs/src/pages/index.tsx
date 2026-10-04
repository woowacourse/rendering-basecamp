import { moviesApi } from '@/api/movies';
import MovieHome from '../components/MovieHome';
import type { MovieItem } from '@/types/Movie.types';
import type { GetServerSideProps } from 'next';

export const getServerSideProps = (async () => {
  try {
    const response = await moviesApi.getPopular();
    return { props: { movies: response.data.results } };
  } catch (error) {
    console.error('영화 불러오기에 실패하였습니다.');
    return { props: { movies: [] } };
  }
}) satisfies GetServerSideProps<{ movies: MovieItem[] }>;

function Home({ movies }: { movies: MovieItem[] }) {
  return <MovieHome movies={movies} />;
}

export default Home;
