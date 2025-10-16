import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { Footer } from "@/components/Footer";
import type { MovieItem } from "@/types/Movie.types";
import type { GetServerSideProps } from "next";
import { moviesApi } from "@/api/movies";
import axios from "axios";

interface MovieHomePageProps {
	movies: MovieItem[];
}

export default function MovieHomePage({ movies }: MovieHomePageProps) {
	return (
		<div id="wrap">
			<Header featuredMovie={movies[0]} />
			<MovieList movies={movies} />
			<Footer />
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async () => {
	try {
		const res = await moviesApi.getPopular();
		return {
			props: {
				movies: res.data.results,
			},
		};
	} catch (error) {
		console.log(error.response?.data);
		return {
			props: {
				movies: [],
			},
		};
	}
};
