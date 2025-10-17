import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  PreviewData,
} from "next";
import { Footer } from "@/components/Footer";
import { moviesApi } from "@/api/movies";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { MetaData } from "@/components/common/MetaData";
import { getAbsolutePageUrl } from "@/utils/getAbsolutePageUrl";
import type { Params } from "next/dist/server/request/params";

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext<Params, PreviewData>) => {
  try {
    const response = await moviesApi.getPopular();
    const movies = Array.isArray(response?.data?.results)
      ? response.data.results
      : [];

    return {
      props: { movies, pageUrl: getAbsolutePageUrl({ req, resolvedUrl }) },
    };
  } catch {
    return { notFound: true };
  }
};

export default function MovieHomePage({
  movies,
  pageUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }
  return (
    <>
      <MetaData pageUrl={pageUrl} />
      <div id='wrap'>
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
