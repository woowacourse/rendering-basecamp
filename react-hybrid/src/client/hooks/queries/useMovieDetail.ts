import { useState, useEffect } from "react";
import { moviesApi } from "../../api/movies";
import type { MovieDetailResponse } from "../../types/MovieDetail.types";

/**
 * 영화 상세 정보를 조회하는 훅
 */

const getInitialDetailData = () => {
  if (
    typeof window === "undefined" ||
    !window.__INITIAL_DATA__ ||
    !window.__INITIAL_DATA__.movieDetail
  ) {
    return null;
  }
  const initialData = window.__INITIAL_DATA__.movieDetail;
  window.__INITIAL_DATA__.movieDetail = undefined;

  return initialData;
};

export const useMovieDetail = (id: number) => {
  const [data, setData] = useState<MovieDetailResponse | null>(
    () => getInitialDetailData() ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id || data) return;

    const fetchMovieDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const movieDetail = await moviesApi.getDetail(id);
        setData(movieDetail.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("영화 상세 정보를 불러오는데 실패했습니다."),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id, data]);

  return { data, isLoading, error };
};
