import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { MovieItem } from '../types/Movie.types';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { router } from '../router/navigation';
import { useRoute } from '../router/useRoute';

interface MovieListPageProps {
  movies: MovieItem[];
  selectedMovie?: MovieDetailResponse;
}

export default function MovieListPage({ movies, selectedMovie }: MovieListPageProps) {
  const { params } = useRoute();

  const isModalOpen =
    params.id && selectedMovie && Number(typeof params.id === 'string' ? params.id : params.id[0]) === selectedMovie.id;

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
      {isModalOpen && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => {
            router.push('/');
          }}
        />
      )}
    </div>
  );
}
