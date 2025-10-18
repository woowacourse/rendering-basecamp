import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { OGMetaTags } from "@/components/OGMetaTags";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps } from "next";

export function MainContent({ movies }: { movies: MovieItem[] }) {
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

function Home({ movies }: { movies: MovieItem[] }) {
  return (
    <>
      <OGMetaTags
        title="영화 리뷰"
        description="오늘 뭐 볼까? 지금 인기 있는 영화를 확인해보세요!"
        url="/"
        image={`https://image.tmdb.org/t/p/original${movies[0].poster_path}`}
      />
      <MainContent movies={movies} />
    </>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
}> = async () => {
  try {
    const moviesData = await moviesApi.getPopular();
    const movies: MovieItem[] = moviesData.data.results;
    return { props: { movies } };
  } catch (error) {
    console.error("영화 데이터를 불러오는 데 실패했습니다.", error);
    return { props: { movies: [] } };
  }
};
