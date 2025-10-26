import { useMovieDetailModal } from '../hooks/useMovieDetailModal';
import { Button } from './common/Button';
import type { MovieItem } from '../types/Movie.types';
import { moviesApi } from '../api/movies';
import { useHistory } from '../hooks/useHistory';

interface FeaturedMovieProps {
  movie: MovieItem;
}

export const FeaturedMovie = ({ movie }: FeaturedMovieProps) => {
  const { openMovieDetailModal } = useMovieDetailModal();
  const { navigate } = useHistory();

  const handleDetailClick = async () => {
    navigate(`/detail/${movie.id}`);
    const movieDetail = await moviesApi.getDetail(movie.id);
    await openMovieDetailModal(movieDetail.data);
  };

  return (
    <div className="top-rated-movie">
      <div className="rate">
        <img
          src="/static/images/star_empty.png"
          width="32"
          height="32"
        />
        <span className="text-2xl font-semibold text-yellow">{movie.vote_average}</span>
      </div>
      <h1 className="text-3xl font-semibold">{movie.title}</h1>
      <Button
        variant="primary"
        onClick={handleDetailClick}
        className="detail"
      >
        자세히 보기
      </Button>
    </div>
  );
};
