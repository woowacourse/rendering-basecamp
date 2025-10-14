import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps } from "next";
import Head from "next/head";

interface HomeProps {
  movies: MovieItem[];
}

export default function Home({ movies }: HomeProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const ogContent = "보고싶은 영화의 리뷰를 확인하세요";
  const ogImage = `https://image.tmdb.org/t/p/w1280${movies[0].poster_path}`;

  return (
    <>
      <Head>
        <title>영화 리뷰 서비스</title>
        <meta name="description" content={ogContent} />
        <meta property="og:title" content={ogContent} />
        <meta property="og:description" content={ogContent} />
        <meta property="og:image" content={ogImage} />
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

    return {
      props: {
        movies: response.data.results,
      },
    };
  } catch (error) {
    console.error("Failed to fetch movies:", error);

    return {
      props: {
        movies: [],
      },
    };
  }
};
