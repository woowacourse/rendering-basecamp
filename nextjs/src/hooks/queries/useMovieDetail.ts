import type { MovieDetailResponse } from '@/types/MovieDetail.types';
import type { QueryResult } from '@/types/Query.types';
import { useQuery } from './useQuery';

export const useMovieDetail = (
  id: number | null,
  initialResult: QueryResult<MovieDetailResponse> | null = null,
) => {
  return useQuery(
    id ? `/api/movies/${id}` : null,
    initialResult,
  );
};
