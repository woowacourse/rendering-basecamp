import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { GetServerSideProps } from "next";
import Head from "next/head";
import type { MovieResponse } from "@/types/Movie.types";

interface Props {
  popularMovies: MovieResponse;
}

export const getServerSideProps = (async () => {
  const { data: popularMovies } = await moviesApi.getPopular(1);
  return { props: { popularMovies } };
}) satisfies GetServerSideProps<Props>;

export default function Home({ popularMovies }: Props) {
  const { results: movies } = popularMovies;
  const featuredMovie = movies[0];
  const ogImagePath = featuredMovie?.backdrop_path ?? featuredMovie?.poster_path;

  return (
    <>
      <Head>
        <title>영화 리뷰</title>
        <meta name="description" content="지금 인기 있는 영화를 확인해 보세요." />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="영화 리뷰" />
        <meta
          key="og:description"
          property="og:description"
          content="지금 인기 있는 영화를 확인해 보세요."
        />
        {ogImagePath && (
          <meta
            key="og:image"
            property="og:image"
            content={`https://image.tmdb.org/t/p/w1280${ogImagePath}`}
          />
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
