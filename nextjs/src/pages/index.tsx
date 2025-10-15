import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { moviesApi } from "@/api/movies";
import { extractCurrentUrlByRequest } from "@/utils/extractCurrentUrlByContext";
import Meta from "@/components/common/Meta";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { req } = context;

    const movieResponse = await moviesApi.getPopular();
    const movies = movieResponse.data.results;

    return {
      props: {
        movies,
        currentUrl: extractCurrentUrlByRequest(req),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

type MovieHomePageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function MovieHomePage({
  movies,
  currentUrl,
}: MovieHomePageProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Meta currentUrl={currentUrl} />
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
