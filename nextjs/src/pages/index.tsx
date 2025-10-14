import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps } from "next";

interface HomeProps {
  movies: MovieItem[];
}

export default function Home({ movies }: HomeProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={movies[0]} />
      <MovieList movies={movies} />
      <Footer />
    </div>
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
