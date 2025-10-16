import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { moviesApi } from "../api/movies";
import type { MovieItem } from "../types/Movie.types";
import type { GetServerSideProps } from "next";
import Head from "next/head";

interface MovieHomePageProps {
  movies: MovieItem[];
}

export default function MovieHomePage({ movies }: MovieHomePageProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }
  const ogContent = "보고싶은 영화의 리뷰를 확인하세요";
  const ogImage = `https://image.tmdb.org/t/p/w1280${movies[0].poster_path}`;

  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content={ogContent} />

        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content="영화 리뷰" />
        <meta property="og:description" content={ogContent} />
        <meta property="og:image" content={ogImage} />
        <meta
          property="og:url"
          content={"https://nextjs-nine-beta-15.vercel.app/"}
        />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  MovieHomePageProps
> = async () => {
  try {
    const response = await moviesApi.getPopular();
    const movies = response.data.results;

    return {
      props: {
        movies,
      },
    };
  } catch {
    return {
      props: {
        movies: [],
      },
    };
  }
};
