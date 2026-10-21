import { Link } from 'react-router-dom';
import type { MovieItem } from '../types/Movie.types';

interface FeaturedMovieProps {
  movie: MovieItem;
}

export const FeaturedMovie = ({ movie }: FeaturedMovieProps) => {
  return (
    <div className="top-rated-movie">
      <div className="rate">
        <img src="/static/images/star_empty.png" width="32" height="32" />
        <span className="text-2xl font-semibold text-yellow">
          {movie.vote_average}
        </span>
      </div>
      <h1 className="text-3xl font-semibold">{movie.title}</h1>
      <Link to={`/detail/${movie.id}`} state={{ fromHome: true }} className="primary detail">
        자세히 보기
      </Link>
    </div>
  );
};
