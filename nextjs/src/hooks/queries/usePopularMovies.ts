import { useState } from "react";
import { MovieItem } from "../../types/Movie.types";

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const usePopularMovies = ({
  initialMovies,
}: {
  initialMovies: MovieItem[];
}) => {
  const [data] = useState<MovieItem[] | null>(initialMovies);

  return { data };
};
