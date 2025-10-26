import type { MovieItem as MovieItemType } from "../types/Movie.types";

interface MovieItemProps {
  movie: MovieItemType;
}

export const MovieItem = ({ movie }: MovieItemProps) => {
  const { title, poster_path, vote_average, id } = movie;

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/static/images/no_image.png";

  return (
    <li className="movie-item" data-index={id}>
      <a
        href={`/detail/${id}`}
        className="item"
        aria-label={`${title} 상세 페이지로 이동`}
      >
        <img className="thumbnail" src={imageUrl} alt={title} loading="lazy" />
        <div className="item-desc">
          <p className="rate">
            <img src="/static/images/star_empty.png" className="star" alt="" />
            <span>{vote_average.toFixed(1)}</span>
          </p>
          <strong>{title}</strong>
        </div>
      </a>
    </li>
  );
};

MovieItem.displayName = "MovieItem";
