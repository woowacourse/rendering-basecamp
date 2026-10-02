import { useState, useEffect } from "react";
import { moviesApi } from "../../api/movies";
import { MovieDetailResponse } from "../../types/MovieDetail.types";

/**
 * 영화 상세 정보를 조회하는 훅
 */
export const useMovieDetail = ({
  initialMovie,
}: {
  initialMovie: MovieDetailResponse;
}) => {
  const [data] = useState<MovieDetailResponse>(initialMovie);

  return { data };
};
