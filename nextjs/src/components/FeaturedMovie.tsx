import { Button } from "@/components/common/Button";
import type { MovieItem } from "@/types/Movie.types";
import Image from "next/image";
import styles from "./FeaturedMovie.module.css";
import { useRouter } from "next/router";

interface FeaturedMovieProps {
  movie: MovieItem;
}

export const FeaturedMovie = ({ movie }: FeaturedMovieProps) => {
  const router = useRouter();

  const handleDetailClick = async (id: number) => {
    router.push(`detail/${id}`);
  };

  return (
    <div className={styles.topRatedMovie}>
      <div className={styles.rate}>
        <Image
          src="/images/star_empty.png"
          width={32}
          height={32}
          alt="empty star"
        />
        <span className="text-2xl font-semibold text-yellow">
          {movie.vote_average}
        </span>
      </div>
      <h1 className="text-3xl font-semibold">{movie.title}</h1>
      <Button
        variant="primary"
        onClick={() => handleDetailClick(movie.id)}
        className="detail"
      >
        자세히 보기
      </Button>
    </div>
  );
};
