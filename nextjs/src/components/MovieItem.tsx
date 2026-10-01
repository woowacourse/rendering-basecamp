import type { MouseEvent } from "react";
import type { MovieItem as MovieItemType } from "../types/Movie.types";

interface MovieItemProps {
  movie: MovieItemType;
  onClick: (movie: MovieItemType) => void;
  ref?: React.Ref<HTMLLIElement>;
}

export const MovieItem = ({ movie, onClick, ref }: MovieItemProps) => {
  const { title, poster_path, vote_average } = movie;

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/images/no_image.png";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onClick(movie);
  };

  return (
    <li ref={ref} className="movie-item" data-index={movie.id}>
      <a className="item" href={`/detail/${movie.id}`} onClick={handleClick}>
        <img className="thumbnail" src={imageUrl} alt={title} loading="lazy" />
        <div className="item-desc">
          <p className="rate">
            <img src="/images/star_empty.png" className="star" />
            <span>{vote_average.toFixed(1)}</span>
          </p>
          <strong>{title}</strong>
        </div>
      </a>
    </li>
  );
};

MovieItem.displayName = "MovieItem";
