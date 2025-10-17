import Link from "next/link";
import type { MovieItem as MovieItemType } from "../types/Movie.types";
import Image from "next/image";

interface MovieItemProps {
  movie: MovieItemType;
}

export const MovieItem = ({ movie }: MovieItemProps) => {
  const { title, poster_path, vote_average } = movie;

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/images/no_image.png";

  return (
    <Link
      href={`/detail/${movie.id}`}
      className='movie-item'
      data-index={movie.id}
    >
      <div className='item'>
        <Image
          className='thumbnail'
          src={imageUrl}
          alt={title}
          loading='lazy'
          width={500}
          height={750}
        />
        <div className='item-desc'>
          <p className='rate'>
            <Image
              src='/images/star_empty.png'
              className='star'
              alt=''
              width={24}
              height={24}
            />
            <span>{vote_average.toFixed(1)}</span>
          </p>
          <strong>{title}</strong>
        </div>
      </div>
    </Link>
  );
};

MovieItem.displayName = "MovieItem";
