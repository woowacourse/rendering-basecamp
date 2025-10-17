import Head from "next/head";
import MovieHomePage from "@/pages/movies";
import type { MovieItem } from "@/types/Movie.types";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { moviesApi } from "@/api/movies";

interface HomeProps {
	movies: MovieItem[];
}

export default function Home({
	movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<Head>
				<title>인기 영화 목록</title>
				<meta
					name="description"
					content="지금 상영 중인 인기 영화의 정보를 확인하세요. "
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<MovieHomePage movies={movies} />
		</>
	);
}

export const getServerSideProps: GetServerSideProps = (async () => {
	try {
		const res = await moviesApi.getPopular();
		return {
			props: {
				movies: res.data.results,
			},
		};
	} catch (error) {
		console.log(`영화 목록 요청 실패: ${error}`);
		return {
			props: {
				movies: [],
			},
		};
	}
}) satisfies GetServerSideProps<HomeProps>;
