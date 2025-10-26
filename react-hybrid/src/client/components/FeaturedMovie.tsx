import { useMovieDetailModal } from "../hooks/useMovieDetailModal";
import { Button } from "./common/Button";
import type { MovieItem } from "../types/Movie.types";
import { moviesApi } from "../api/movies";
import { Link } from "react-router-dom";

interface FeaturedMovieProps {
	movie: MovieItem;
}

export const FeaturedMovie = ({ movie }: FeaturedMovieProps) => {
	return (
		<div className="top-rated-movie">
			<div className="rate">
				<img
					src="/images/star_empty.png"
					width="32"
					height="32"
					alt="별점 빈 별"
				/>
				<span className="text-2xl font-semibold text-yellow">
					{movie.vote_average}
				</span>
			</div>
			<h1 className="text-3xl font-semibold">{movie.title}</h1>
			<Link to={`/detail/${movie.id}`}>
				<Button variant="primary" className="detail">
					자세히 보기
				</Button>
			</Link>
		</div>
	);
};
