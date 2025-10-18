import Image from "next/image";
import type { MovieItem as MovieItemType } from "../types/Movie.types";
import Link from "next/link";

interface MovieItemProps {
  movie: MovieItemType;
  ref?: React.Ref<HTMLLIElement>;
}

export const MovieItem = ({ movie, ref }: MovieItemProps) => {
  const { title, poster_path, vote_average } = movie;

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/images/no_image.png";

  return (
    <li className="movie-item" data-index={movie.id}>
      <Link href={`/detail/${movie.id}`}>
        <div className="item">
          <Image
            className="thumbnail"
            src={imageUrl}
            alt={title}
            width={200}
            height={300}
            loading="lazy"
          />
          <div className="item-desc">
            <p className="rate">
              <Image
                alt=""
                src="/images/star_empty.png"
                className="star"
                width={16}
                height={16}
              />
              <span>{vote_average.toFixed(1)}</span>
            </p>
            <strong>{title}</strong>
          </div>
        </div>
      </Link>
    </li>
  );
};

MovieItem.displayName = "MovieItem";
