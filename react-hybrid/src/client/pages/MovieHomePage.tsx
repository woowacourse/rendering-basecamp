import { useState, useCallback, useEffect } from "react";

import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { Loading } from "../components/common/Loading";
import { MovieDetailModal } from "../components/MovieDetailModal";

import { usePopularMovies } from "../hooks/queries/usePopularMovies";
import { useShallowMovieRoute } from "../hooks/useShallowMovieRoute";
import { useInitialData } from "../lib/InitialDataContext";

import type { MovieDetailResponse } from "../types/MovieDetail.types";
import { moviesApi } from "../api/movies";

export default function MovieHomePage() {
  const { data: movies, isLoading } = usePopularMovies();
  const initialData = useInitialData();

  const [selectedMovie, setSelectedMovie] =
    useState<MovieDetailResponse | null>(null);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
    closeShallow();
  }, []);

  const { openShallow, closeShallow } = useShallowMovieRoute({
    onCloseModal: handleCloseModal,
  });

  const handleMovieClick = useCallback(
    async (movieId: number) => {
      openShallow(movieId);

      try {
        const res = await moviesApi.getDetail(movieId);
        const detail: MovieDetailResponse = res.data;
        setSelectedMovie(detail);
      } catch (err) {
        console.error("영화 상세 정보를 불러오는 데 실패했습니다:", err);
        closeShallow();
      }
    },
    [openShallow, closeShallow]
  );

  useEffect(() => {
    if (initialData?.movieDetail) {
      setSelectedMovie(initialData.movieDetail);
    }
  }, [initialData]);

  if (isLoading === true) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />

      <MovieList movies={movies} onSelectMovie={handleMovieClick} />

      <Footer />

      {selectedMovie && (
        <MovieDetailModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
