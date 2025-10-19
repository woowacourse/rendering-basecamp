import { Header } from './Header';
import { MovieList } from './MovieList';
import { Footer } from './Footer';
import { MovieItem } from '@/types/Movie.types';
import { ReactNode } from 'react';

interface MovieLayoutProps {
  movies: MovieItem[];
  children?: ReactNode;
}

export function MovieLayout({ movies, children }: MovieLayoutProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
      {children}
    </div>
  );
}
