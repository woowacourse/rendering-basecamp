import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { Button } from "./common/Button";
import { moviesApi } from "../api/movies";
import { MovieItemType } from "@/types/Movie.types";
import Link from "next/link";

interface FeaturedMovieProps {
  movie: MovieItemType;
}

export const FeaturedMovie = ({ movie }: FeaturedMovieProps) => {
  const { openMovieDetailModal } = useMovieDetailModal();

  // const handleDetailClick = async () => {
  //   const movieDetail = await moviesApi.getDetail(movie.id);
  //   await openMovieDetailModal(movieDetail.data);
  // };

  return (
    <div className="top-rated-movie">
      <div className="rate">
        <img src="/images/star_empty.png" width="32" height="32" />
        <span className="text-2xl font-semibold text-yellow">
          {movie.vote_average}
        </span>
      </div>
      <h1 className="text-3xl font-semibold">{movie.title}</h1>
      <Link href={`/detail/${movie.id}`}>
        <Button variant="primary" className="detail">
          자세히 보기
        </Button>
      </Link>
    </div>
  );
};
