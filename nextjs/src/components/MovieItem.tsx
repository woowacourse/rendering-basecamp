import Image from "next/image";
import Link from "next/link";
import type { MovieItem as MovieItemType } from "@/types/Movie.types";
import { movieImageUrl } from "@/utils/movieImage";

export const MovieItem = ({ movie }: { movie: MovieItemType }) => (
  <li className="movie-item" data-index={movie.id}>
    <Link href={`/detail/${movie.id}`} prefetch={false} className="item">
      <Image
        className="thumbnail"
        src={movieImageUrl(movie.poster_path)}
        alt={movie.title}
        width={200}
        height={300}
        sizes="200px"
      />
      <div className="item-desc">
        <p className="rate">
          <Image src="/images/star_empty.png" className="star" width={16} height={16} alt="평점" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </p>
        <strong>{movie.title}</strong>
      </div>
    </Link>
  </li>
);
