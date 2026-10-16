import Head from '../framework/head/Head';
import type { ReactElement } from 'react';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { Footer } from '../components/Footer';
import { MovieItem } from '../types/Movie.types';
import { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailModal } from '../components/MovieDetailModal';
import { router } from '../framework/router/navigation';
import { useRoute } from '../framework/router/useRoute';

interface MovieListPageProps {
  movies: MovieItem[];
  selectedMovie?: MovieDetailResponse;
}

export default function MovieListPage({ movies, selectedMovie }: MovieListPageProps): ReactElement {
  const { params } = useRoute();
  const selectedMovieId = params?.id;

  const isModalOpen =
    selectedMovieId &&
    selectedMovie &&
    Number(typeof selectedMovieId === 'string' ? selectedMovieId : selectedMovieId[0]) === selectedMovie.id;

  return (
    <>
      <Head>
        <title>인기 영화 | 영화 리뷰</title>
        <meta name="description" content="인기 영화를 살펴보고 나만의 별점을 남겨보세요." />
        <meta property="og:title" content="인기 영화 | 영화 리뷰" />
        <meta property="og:description" content="인기 영화를 살펴보고 나만의 별점을 남겨보세요." />
      </Head>

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
    </>
  );
}
