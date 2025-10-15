import type { GetServerSideProps } from "next";
import Head from "next/head";
import { moviesApi } from "../api/movies";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import type { MovieItem } from "../types/Movie.types";

interface HomeProps {
  movies: MovieItem[];
}

const homeTitle = "영화 추천 사이트";
const homeDescription =
  "인기 영화를 추천해드립니다. 최신 영화 정보와 평점을 확인하세요.";

export default function Home({ movies }: HomeProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>{homeTitle}</title>
        <meta name="description" content={homeDescription} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={homeTitle} />
        <meta property="og:description" content={homeDescription} />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/w1200${movies[0]?.poster_path}`}
        />
        <meta
          property="og:url"
          content="https://rendering-basecamp-xi.vercel.app/"
        />
        <meta property="og:site_name" content={homeTitle} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={homeTitle} />
        <meta name="twitter:description" content={homeDescription} />
        <meta
          name="twitter:image"
          content={`https://image.tmdb.org/t/p/w1200${movies[0]?.poster_path}`}
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

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const response = await moviesApi.getPopular();
    const movies = response.data.results;
    return { props: { movies } };
  } catch (error) {
    console.error("영화 정보를 불러오는 데 실패했습니다:", error);
    return { props: { movies: [] } };
  }
};
