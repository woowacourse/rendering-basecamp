import type { GetServerSideProps } from "next";
import { moviesApi } from "@/api/movies";
import MovieHomePage from "@/pages/movies";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { MovieItem } from "@/types/Movie.types";

interface MovieDetailPageProps {
	movie: MovieDetailResponse;
}

export default function MovieDetailPage({ movie }: MovieDetailPageProps) {
	const genreIds = movie.genres.map((genre) => genre.id);
	const movieItem: MovieItem = {
		...movie,
		genre_ids: genreIds,
	};
	return <MovieHomePage movies={[movieItem]} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	// biome-ignore lint/style/noNonNullAssertion: URL의 [id] 값
	const { id } = context.params!;
	try {
		const res = await moviesApi.getDetail(Number(id));
		return {
			props: { movie: res.data },
		};
	} catch (error) {
		console.error("영화 데이터를 불러오는 중 오류 발생:", error);
		return {
			notFound: true,
		};
	}
};
