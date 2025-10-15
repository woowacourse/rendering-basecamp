import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { SeoHead } from "@/components/SeoHead";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps } from "next";
import Head from "next/head";

interface MoviesPageProps {
  movies: MovieItem[];
}

export default function Home({ movies }: MoviesPageProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const featured = movies[0];

  return (
    <>
      <SeoHead
        title="인기 영화 추천"
        description="지금 인기 있는 영화들을 만나보세요."
        image={`https://image.tmdb.org/t/p/w1280${featured.backdrop_path}`}
        url="https://my-movie-app.com"
      />

      <div id="wrap">
        <Header featuredMovie={featured} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await moviesApi.getPopular();
    const movies = res.data.results;

    return {
      props: {
        movies,
      },
    };
  } catch (error) {
    console.error("영화 데이터 패칭 실패:", error);
    return {
      props: {
        movies: [],
      },
    };
  }
};
