import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { Footer } from "@/components/Footer";
import type { MovieItem } from "@/types/Movie.types";

interface MovieHomePageProps {
	movies: MovieItem[];
}

export default function MovieHomePage({ movies = [] }: MovieHomePageProps) {
	return (
		<div id="wrap">
			<Header featuredMovie={movies[0] || null} />
			<MovieList movies={movies} />
			<Footer />
		</div>
	);
}
