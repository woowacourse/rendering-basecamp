import type { MovieItem as MovieItemType } from '../types/Movie.types';

interface MovieItemProps {
  movie: MovieItemType;
  ref?: React.Ref<HTMLLIElement>;
}

export const MovieItem = ({ movie, ref }: MovieItemProps) => {
  const { title, poster_path, vote_average } = movie;

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : '/static/images/no_image.png';

  return (
    <li
      ref={ref}
      className="movie-item"
      data-index={movie.id}
    >
      <div className="item">
        <img className="thumbnail" src={imageUrl} alt={title} loading="lazy" />
        <div className="item-desc">
          <p className="rate">
            <img src="/static/images/star_empty.png" className="star" />
            <span>{vote_average.toFixed(1)}</span>
          </p>
          <strong>{title}</strong>
        </div>
      </div>
    </li>
  );
};


