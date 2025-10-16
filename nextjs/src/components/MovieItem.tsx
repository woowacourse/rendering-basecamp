import type { MovieItem as MovieItemType } from '../types/Movie.types';
import Image from 'next/image';

interface MovieItemProps {
  movie: MovieItemType;
  onClick: (movie: MovieItemType) => void;
  ref?: React.Ref<HTMLLIElement>;
}

export const MovieItem = ({ movie, onClick, ref }: MovieItemProps) => {
  const { title, poster_path, vote_average } = movie;

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : '/images/no_image.png';

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
        <Image
          className="thumbnail"
          src={imageUrl}
          alt={title}
          width={500}
          height={750}
          loading="lazy"
        />
        <div className="item-desc">
          <p className="rate">
            <Image src="/images/star_empty.png" className="star" width={16} height={16} alt="star" />
            <span>{vote_average.toFixed(1)}</span>
          </p>
          <strong>{title}</strong>
        </div>
      </div>
    </li>
  );
};

MovieItem.displayName = 'MovieItem';
