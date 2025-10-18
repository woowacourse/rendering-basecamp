import type { MovieItem } from './Movie.types';

declare global {
  interface Window {
    __INITIAL_DATA__?: {
      movies: MovieItem[];
    };
  }
}

export {};
