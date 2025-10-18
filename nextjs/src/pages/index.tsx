import type { GetServerSideProps } from "next";
import { moviesApi } from "../api/movies";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { OGMetaTags } from "../components/OGMetaTags";
import { HOME_URL, getTMDBImageUrl } from "../constants/urls";
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
      <OGMetaTags
        title={homeTitle}
        description={homeDescription}
        url={HOME_URL}
        image={getTMDBImageUrl(movies[0]?.poster_path, "original")}
      />
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
