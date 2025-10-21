import { moviesApi } from "../api/movies";
import { MovieItem } from "../types/Movie.types";
import { useMovieDetailModal } from "./useMovieDetailModal";

export const useMovieClickHandler = () => {
  const { openMovieDetailModal } = useMovieDetailModal();

  const handleMovieClick = async (movie: MovieItem) => {
    try {
      const detailUrl = `/detail/${movie.id}`;
      window.history.pushState({ movieId: movie.id }, "", detailUrl);

      const movieDetail = await moviesApi.getDetail(movie.id);
      await openMovieDetailModal(movieDetail.data);
    } catch {
      alert("영화 정보를 불러오지 못했습니다.");
      window.history.back();
    }
  };

  return { handleMovieClick };
};
