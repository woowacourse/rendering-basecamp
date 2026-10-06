import type { MovieItem } from '@/types/Movie.types';
import type { QueryResult } from '@/types/Query.types';
import { useQuery } from './useQuery';

export const usePopularMovies = (initialResult: QueryResult<MovieItem[]> | null = null) => {
  return useQuery('/api/movies/popular', initialResult);
};
