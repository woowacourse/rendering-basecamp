import type { MovieSummary } from '../types/Movie.types';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const THUMBNAIL_WIDTH = '200px';

interface MovieItemProps {
  movie: MovieSummary;
  onClick: (movie: MovieSummary) => void;
  ref?: React.Ref<HTMLLIElement>;
}

export const MovieItem = ({ movie, onClick, ref }: MovieItemProps) => {
  const { title, poster_path, vote_average } = movie;

  const imageUrl = poster_path
    ? `${TMDB_IMAGE_BASE_URL}/w500${poster_path}`
    : '/images/no_image.png';
  const imageSrcSet = poster_path
    ? `${TMDB_IMAGE_BASE_URL}/w342${poster_path} 342w, ${TMDB_IMAGE_BASE_URL}/w500${poster_path} 500w`
    : undefined;

  const handleClick = () => {
    onClick(movie);
  };

  return (
    <li
      ref={ref}
      className="movie-item"
      onClick={handleClick}
      data-index={movie.id}
    >
      <div className="item">
        <img
          className="thumbnail"
          src={imageUrl}
          srcSet={imageSrcSet}
          sizes={THUMBNAIL_WIDTH}
          alt={title}
          loading="lazy"
        />
        <div className="item-desc">
          <p className="rate">
            <img src="/images/star_empty.png" className="star" />
            <span>{vote_average.toFixed(1)}</span>
          </p>
          <strong>{title}</strong>
        </div>
      </div>
    </li>
  );
};

MovieItem.displayName = 'MovieItem';
