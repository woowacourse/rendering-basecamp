import Image from "next/image";
import type { MovieItem as MovieItemType } from "@/types/Movie.types";
import styles from "./MovieItem.module.css";

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
    <li ref={ref} className={styles.movieItem} data-index={movie.id}>
      <div className={styles.item}>
        <Image
          className={styles.thumbnail}
          src={imageUrl}
          alt={title}
          loading="lazy"
          width={200}
          height={300}
        />
        <div className={styles.itemDesc}>
          <p className={styles.rate}>
            <Image
              src="/images/star_empty.png"
              className={styles.star}
              alt="empty star"
              width={16}
              height={16}
            />
            <span>{vote_average.toFixed(1)}</span>
          </p>
          <strong>{title}</strong>
        </div>
      </div>
    </li>
  );
};

MovieItem.displayName = "MovieItem";
