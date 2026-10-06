import { useRouter } from 'next/router';
import { Button } from './common/Button';
import type { MovieItem } from '../types/Movie.types';

interface FeaturedMovieProps {
  movie?: MovieItem | null;
  error?: Error | null;
}

export const FeaturedMovie = ({ movie, error }: FeaturedMovieProps) => {
  const router = useRouter();

  if (error) {
    return (
      <div className="top-rated-movie" role="alert">
        <h1 className="text-3xl font-semibold">추천 영화를 불러오지 못했습니다.</h1>
        <p className="text-opacity-blue">{error.message}</p>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="top-rated-movie">
      <div className="rate">
        <img src="/images/star_empty.png" width="32" height="32" />
        <span className="text-2xl font-semibold text-yellow">{movie.vote_average}</span>
      </div>
      <h1 className="text-3xl font-semibold">{movie.title}</h1>
      <Button
        variant="primary"
        className="detail"
        onClick={() =>
          router.push(`/detail/${movie.id}`, undefined, {
            scroll: false,
            shallow: true,
          })
        }
      >
        자세히 보기
      </Button>
    </div>
  );
};
