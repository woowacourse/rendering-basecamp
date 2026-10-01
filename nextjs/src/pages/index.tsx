import Head from "next/head";
import { GetServerSideProps } from "next";
import { moviesApi } from "@/api/movies";
import MovieHome from "@/components/MovieHome";
import { MovieHomeProps } from "@/components/MovieHome";

export const getServerSideProps = (async () => {
  const response = await moviesApi.getPopular();
  return { props: { movies: response.data.results } };
}) satisfies GetServerSideProps<MovieHomeProps>;

export default function Home({ movies }: MovieHomeProps) {
  if (movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>영화 리뷰</title>
        <meta
          name="description"
          content="인기 영화를 살펴보고 별점을 남겨보세요."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MovieHome movies={movies} />
    </>
  );
}
