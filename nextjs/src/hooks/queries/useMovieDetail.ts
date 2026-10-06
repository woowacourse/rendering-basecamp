import { useState, useEffect } from "react";
import { moviesApi } from "../../api/movies";
import { MovieDetailResponse } from "../../types/MovieDetail.types";

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const useMovieDetail = ({
  initialMovie,
}: {
  initialMovie: MovieDetailResponse | null;
}) => {
  const [data] = useState<MovieDetailResponse | null>(initialMovie);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  return { data, isLoading, error };
};
