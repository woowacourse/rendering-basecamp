import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps } from "next";

function Home({ movies }: { movies: MovieItem[] }) {
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

export default Home;

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
}> = async () => {
  try {
    const movieDetail = await moviesApi.getPopular();
    const movies: MovieItem[] = movieDetail.data.results;
    return { props: { movies } };
  } catch (error) {
    console.error("영화 데이터를 불러오는 데 실패했습니다.", error);
    return { props: { movies: [] } };
  }
};
