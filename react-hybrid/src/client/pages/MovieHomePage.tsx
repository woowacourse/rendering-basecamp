import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { moviesApi } from "../api/movies";
import type { InferGetServerDataType } from "../types";
import Meta from "../components/common/Meta";
import type { GetServerDataParams } from "../../server/routes";
import { Suspense } from "react";
import DelayWithThrowPromise from "../components/common/DelayWithThrowPromise";

export const getServerData = async ({ currentUrl }: GetServerDataParams) => {
  try {
    const popularMovie = await moviesApi.getPopular();
    return { popularMovie: popularMovie.data.results, currentUrl };
  } catch (error) {
    return { popularMovie: null, currentUrl };
  }
};

type MovieHomePageProps = InferGetServerDataType<typeof getServerData>;

export default function MovieHomePage({
  popularMovie,
  currentUrl,
}: MovieHomePageProps) {
  if (popularMovie == null || popularMovie.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Meta currentUrl={currentUrl} />
      <div id="wrap">
        <Suspense
          fallback={<div>헤더 로딩중(스트리밍 테스트, 5초 딜레이)...</div>}
        >
          <DelayWithThrowPromise ms={5000}>
            <Header featuredMovie={popularMovie[0]} />
          </DelayWithThrowPromise>
        </Suspense>
        <MovieList movies={popularMovie} />
        <Footer />
      </div>
    </>
  );
}
