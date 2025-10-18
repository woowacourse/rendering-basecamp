import { moviesApi } from "../api/movies";
import type { InferGetServerDataType } from "../types";
import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { useEffect } from "react";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";

export const getServerData = async ({ movieId }: Record<string, string>) => {
  try {
    const [popularMovie, movieDetail] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    return {
      popularMovie: popularMovie.data.results,
      movieDetail: movieDetail.data,
    };
  } catch (error) {
    return {
      popularMovie: [],
      movieDetail: null,
    };
  }
};

type MovieDetailPageProps = InferGetServerDataType<typeof getServerData>;

export default function MovieDetailPage({
  popularMovie,
  movieDetail,
}: MovieDetailPageProps) {
  const { openMovieDetailModal } = useMovieDetailModal();

  useEffect(() => {
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return (
    <div id="wrap">
      <Header featuredMovie={popularMovie[0]} />
      <MovieList movies={popularMovie} />
      <Footer />
    </div>
  );
}
