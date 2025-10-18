import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { moviesApi } from "../api/movies";
import type { InferGetServerDataType } from "../types";

export const getServerData = async () => {
  try {
    const popularMovie = await moviesApi.getPopular();
    return { popularMovie: popularMovie.data.results };
  } catch (error) {
    return { popularMovie: null };
  }
};

type MovieHomePageProps = InferGetServerDataType<typeof getServerData>;

export default function MovieHomePage({ popularMovie }: MovieHomePageProps) {
  if (popularMovie == null || popularMovie.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div id="wrap">
      <Header featuredMovie={popularMovie[0]} />
      <MovieList movies={popularMovie} />
      <Footer />
    </div>
  );
}
