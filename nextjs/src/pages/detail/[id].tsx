import type { GetServerSideProps } from "next";
import { moviesApi } from "@/api/movies";
import MovieHomePage from "@/pages/movies";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { MovieItem } from "@/types/Movie.types";
import Head from "next/head";

interface MovieDetailPageProps {
	movie: MovieDetailResponse;
}

export default function MovieDetailPage({ movie }: MovieDetailPageProps) {
	const genreIds = movie.genres?.map((genre) => genre.id) || [];
	const movieItem: MovieItem = {
		...movie,
		genre_ids: genreIds,
	};
	return (
		<>
			<Head>
				<title>{movie.title}</title>
				<meta
					name="description"
					content={movie.overview || "줄거리 정보가 없습니다."}
				/>

				<meta property="og:type" content="website" />
				<meta property="og:title" content={movie.title} />
				<meta
					property="og:description"
					content={movie.overview || "줄거리 정보가 없습니다."}
				/>
				<meta
					property="og:image"
					content={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
				/>
				<meta
					property="og:url"
					content={`https://rendering-basecamp-gold.vercel.app/movies/${movie.id}`}
				/>

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={movie.title} />
				<meta
					name="twitter:description"
					content={movie.overview || "줄거리 정보가 없습니다."}
				/>
				<meta
					name="twitter:image"
					content={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
				/>
			</Head>
			<MovieHomePage movies={[movieItem]} />
		</>
	);
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
