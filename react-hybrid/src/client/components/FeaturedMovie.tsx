import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { Button } from './common/Button';
import type { MovieItem } from '../types/Movie.types';
import { moviesApi } from '../api/movies';

interface FeaturedMovieProps {
  movie: MovieItem;
}

export const FeaturedMovie = ({ movie }: FeaturedMovieProps) => {
  const { openMovieDetailModal } = useMovieDetailModal();

  const handleDetailClick = async () => {
    const movieDetail = await moviesApi.getDetail(movie.id);
    const prevPath = window.location.pathname;

    window.history.pushState({ movieId: movie.id }, '', `/detail/${movie.id}`);

    try {
      await openMovieDetailModal(movieDetail.data);
    } finally {
      window.history.replaceState({}, '', prevPath);
    }
  };

  return (
    <div className="top-rated-movie">
      <div className="rate">
        <img src="/static/images/star_empty.png" width="32" height="32" />
        <span className="text-2xl font-semibold text-yellow">
          {movie.vote_average}
        </span>
      </div>
      <h1 className="text-3xl font-semibold">{movie.title}</h1>
      <Button variant="primary" onClick={handleDetailClick} className="detail">
        자세히 보기
      </Button>
    </div>
  );
};
