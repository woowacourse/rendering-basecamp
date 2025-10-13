import Head from "next/head";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { moviesApi } from "@/api/movies";
import type { MovieItem } from "@/types/Movie.types";
import type { GetServerSideProps } from "next";

interface MovieHomePageProps {
  movies: MovieItem[];
}

export default function MovieHomePage({ movies }: MovieHomePageProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const ogImageUrl = movies[0]?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`
    : `https://image.tmdb.org/t/p/original${movies[0]?.poster_path}`;

  return (
    <>
      <Head>
        <title>인기 영화 - Movie Database</title>
        <meta
          name="description"
          content="최신 인기 영화 정보를 확인하세요. TMDB 기반 영화 데이터베이스"
          key="description"
        />
        <meta
          property="og:url"
          content="https://rendering-basecamp-git-guesung-gueit214s-projects.vercel.app/"
          key="og:url"
        />
        <meta
          property="og:title"
          content="인기 영화 - Movie Database"
          key="og:title"
        />
        <meta
          property="og:description"
          content="최신 인기 영화 정보를 확인하세요"
          key="og:description"
        />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:image" content={ogImageUrl} key="og:image" />
        <meta property="og:image:width" content="1280" key="og:image:width" />
        <meta property="og:image:height" content="720" key="og:image:height" />
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter:card"
        />
        <meta
          name="twitter:title"
          content="인기 영화 - Movie Database"
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content="최신 인기 영화 정보를 확인하세요"
          key="twitter:description"
        />
        <meta name="twitter:image" content={ogImageUrl} key="twitter:image" />
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
  } catch (error) {
    console.error("영화 정보를 불러오는데 실패했습니다:", error);
    return {
      props: {
        movies: [],
      },
    };
  }
};
