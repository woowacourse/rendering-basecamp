import { moviesApi } from "@/api/movies";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

export default function MovieHomePage({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const featured = movies[0];

  return (
    <>
      <Head>
        <title>🎬 Movie List</title>
        <meta
          name='description'
          content='지금 전 세계에서 가장 인기 있는 영화들을 만나보세요. 최신 트렌드부터 추천작까지 한눈에!'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Movie Planet' />
        <meta property='og:title' content='🎬 Movie List' />
        <meta
          property='og:description'
          content='영화 팬이라면 놓칠 수 없는 최신 인기작 모음! 지금 가장 사랑받는 영화를 만나보세요.'
        />
        <meta
          property='og:image'
          content={
            featured?.poster_path
              ? `https://image.tmdb.org/t/p/w780${featured.poster_path}`
              : "https://your-domain.com/images/og-default.png"
          }
        />
        {/* 추후 수정 예정 */}
        {/* <meta
          property='og:url'
          content={`https://hoyychoi.com/detail/${detail.id}`}
        /> */}
      </Head>
      <div id='wrap'>
        <Header featuredMovie={featured} />
        <MovieList movies={movies} />
      </div>
    </>
  );
}

export const getServerSideProps = (async () => {
  const response = await moviesApi.getPopular();
  const movies = response.data.results;

  if (!movies || movies.length === 0) {
    return {
      notFound: true,
    };
  }

  return { props: { movies } };
}) satisfies GetServerSideProps<{ movies: MovieItem[] }>;
