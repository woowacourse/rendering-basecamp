import Link from 'next/link';
import type { MovieItem } from '../types/Movie.types';
import { Button } from './common/Button';

interface FeaturedMovieProps {
  movie: MovieItem;
}

export const FeaturedMovie = ({ movie }: FeaturedMovieProps) => {
  return (
    <div className="top-rated-movie">
      <div className="rate">
        <img src="/images/star_empty.png" width="32" height="32" />
        <span className="text-2xl font-semibold text-yellow">
          {movie.vote_average}
        </span>
      </div>
      <h1 className="text-3xl font-semibold">{movie.title}</h1>
      <Link href={`detail/${movie.id}`}>
        <Button variant="primary" className="detail">
          자세히 보기
        </Button>
      </Link>
    </div>
  );
};
