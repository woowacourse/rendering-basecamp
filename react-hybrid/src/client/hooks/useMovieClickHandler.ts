import { useMovieDetailModal } from "./useMovieDetailModal";
import { moviesApi } from "../api/movies";
import { MovieItem } from "../types/Movie.types";

export const useMovieClickHandler = () => {
  const { openMovieDetailModal } = useMovieDetailModal();

  const handleMovieClick = async (movie: MovieItem) => {
    window.history.pushState(null, "", `/detail/${movie.id}`);

    const movieDetail = await moviesApi.getDetail(movie.id);

    await openMovieDetailModal(movieDetail.data);
  };

  return { handleMovieClick };
};
