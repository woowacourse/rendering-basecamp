import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { MovieItem } from "./MovieItem";
import type { MovieItem as MovieItemType } from "../types/Movie.types";
import { moviesApi } from "../api/movies";

export const MovieList = ({ movies }: { movies: MovieItemType[] }) => {
  const { openMovieDetailModal } = useMovieDetailModal();

  const handleMovieClick = async (movie: MovieItemType) => {
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

  return (
    <main>
      <section className="container">
        <h2 className="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul className="thumbnail-list">
          {movies.map((movie) => (
            <MovieItem
              key={movie.id}
              movie={movie}
              onClick={handleMovieClick}
            />
          ))}
        </ul>
      </section>
    </main>
  );
};
