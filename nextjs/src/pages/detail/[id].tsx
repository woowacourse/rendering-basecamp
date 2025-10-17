import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import { moviesApi } from "@/api/movies";
import MovieHomePage from "@/pages/movies";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { MovieItem } from "@/types/Movie.types";
import Head from "next/head";

interface MovieDetailPageProps {
	movies: MovieItem[];
	movieDetail: MovieDetailResponse;
}

export default function MovieDetailPage({
	movies,
	movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<Head>
				<title>{movieDetail.title}</title>
				<meta
					name="description"
					content={movieDetail.overview || "줄거리 정보가 없습니다."}
				/>

				<meta property="og:type" content="website" />
				<meta property="og:title" content={movieDetail.title} />
				<meta
					property="og:description"
					content={movieDetail.overview || "줄거리 정보가 없습니다."}
				/>
				<meta
					property="og:image"
					content={`https://image.tmdb.org/t/p/original${movieDetail.poster_path}`}
				/>
				<meta
					property="og:url"
					content={`https://rendering-basecamp-gold.vercel.app/movies/${movieDetail.id}`}
				/>

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={movieDetail.title} />
				<meta
					name="twitter:description"
					content={movieDetail.overview || "줄거리 정보가 없습니다."}
				/>
				<meta
					name="twitter:image"
					content={`https://image.tmdb.org/t/p/original${movieDetail.poster_path}`}
				/>
			</Head>
			<MovieHomePage movies={movies} />
		</>
	);
}

export const getServerSideProps: GetServerSideProps = (async (context) => {
	// biome-ignore lint/style/noNonNullAssertion: URL의 [id] 값
	const { id } = context.params!;
	try {
		const res = await moviesApi.getDetail(Number(id));
		const popularMovies = await moviesApi.getPopular();
		return {
			props: { movies: popularMovies.data.results, movieDetail: res.data },
		};
	} catch (error) {
		console.error("영화 데이터를 불러오는 중 오류 발생:", error);
		return {
			notFound: true,
		};
	}
}) satisfies GetServerSideProps<MovieDetailPageProps>;
