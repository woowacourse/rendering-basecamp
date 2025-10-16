import Head from "next/head";
import { GetServerSideProps } from "next";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { moviesApi } from "../api/movies";
import type { MovieItem } from "../types/Movie.types";

interface HomeProps {
  movies: MovieItem[];
}

export default function Home({ movies }: HomeProps) {
  if (!movies || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const featuredMovie = movies[0];
  const ogImage = featuredMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${featuredMovie.poster_path}`
    : '/images/logo.png';

  return (
    <>
      <Head>
        <title>영화 정보 - MovieList</title>
        <meta name="description" content="인기 영화 정보를 확인하세요. 최신 인기 영화와 평점을 한눈에 확인할 수 있습니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:title" content="영화 정보 - MovieList" />
        <meta property="og:description" content="인기 영화 정보를 확인하세요. 최신 인기 영화와 평점을 한눈에 확인할 수 있습니다." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="영화 정보 - MovieList" />
        <meta name="twitter:description" content="인기 영화 정보를 확인하세요" />
        <meta name="twitter:image" content={ogImage} />

        <link
          rel="preload"
          as="image"
          href={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${featuredMovie.poster_path}`}
        />
      </Head>
      <div id="wrap">
        <Header featuredMovie={featuredMovie} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const response = await moviesApi.getPopular();
    return {
      props: {
        movies: response.data.results,
      },
    };
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return {
      props: {
        movies: [],
      },
    };
  }
};

