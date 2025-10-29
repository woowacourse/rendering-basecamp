import type { MovieItem as MovieItemType } from "../types/Movie.types";

interface MovieItemProps {
  movie: MovieItemType;
  ref?: React.Ref<HTMLLIElement>;
  onClick: (movie: MovieItemType) => void;
}

export const MovieItem = ({ movie, ref, onClick }: MovieItemProps) => {
  const { title, poster_path, vote_average } = movie;

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/images/no_image.png";

  const handleClick = () => {
    onClick(movie);
  };

  return (
    <li
      ref={ref}
      className="movie-item"
      data-index={movie.id}
      onClick={handleClick}
    >
      <div className="item">
        <img className="thumbnail" src={imageUrl} alt={title} loading="lazy" />
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

MovieItem.displayName = "MovieItem";
