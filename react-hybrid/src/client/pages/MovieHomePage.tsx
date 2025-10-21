import { overlay } from 'overlay-kit';
import { Loading } from '../components/common/Loading';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { MovieDetailModalLoader } from '../components/MovieDetailModalLoader';
import { MovieList } from '../components/MovieList';
import { usePopularMovies } from '../hooks/queries/usePopularMovies';
import { useEffect } from 'react';
import { InitialData } from '../types/global';

interface MovieHomePageProps {
  initialData: InitialData;
}

export default function MovieHomePage({ initialData }: MovieHomePageProps) {
  const { data, isLoading } = usePopularMovies(initialData?.movies);

  const movies = data ?? initialData.movies;

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const detailMatch = path.match(/^\/detail\/(\d+)$/);

      if (detailMatch) {
        const movieId = parseInt(detailMatch[1], 10);
        overlay.open(({ unmount }) => (
          <MovieDetailModalLoader
            movieServerData={initialData.movie}
            movieId={movieId}
            close={() => {
              unmount();
              if (window.location.pathname !== '/') {
                window.history.pushState({}, '', '/');
              }
            }}
          />
        ));
      } else {
        overlay.unmountAll();
      }
    };

    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (isLoading === true) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
  );
}
