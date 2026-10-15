import React, { useEffect, useState } from "react";
import MovieHomePage from "./pages/MovieHomePage";
import { MovieDetailModal } from "./components/MovieDetailModal";
import { moviesApi } from "./api/movies";
import type { InitialData } from "./types/InitialData.types";
import type { MovieDetailResponse } from "./types/MovieDetail.types";

interface AppProps {
  initialData: InitialData;
}

function App({ initialData }: AppProps) {
  const [movieDetail, setMovieDetail] = useState<MovieDetailResponse | null>(
    initialData.movieDetail
  );

  // hydration이 끝난 뒤 한 번 실행된다. (서버에서는 실행되지 않는다)
  useEffect(() => {
    // 브라우저 뒤로/앞으로 가기를 하면, 그 기록에 저장해 둔 상세 정보로 화면을 맞춘다.
    window.history.replaceState({ movieDetail: initialData.movieDetail }, "");
    const handlePopState = (event: PopStateEvent) => {
      setMovieDetail(event.state?.movieDetail ?? null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.title = movieDetail
      ? `${movieDetail.title} - 영화 리뷰`
      : "영화 리뷰";
  }, [movieDetail]);

  const openMovieDetail = async (movieId: number) => {
    const detail = await moviesApi.getDetail(movieId);
    window.history.pushState({ movieDetail: detail }, "", `/detail/${movieId}`);
    setMovieDetail(detail);
  };

  const closeMovieDetail = () => {
    window.history.pushState({ movieDetail: null }, "", "/");
    setMovieDetail(null);
  };

  return (
    <>
      <MovieHomePage
        movies={initialData.movies}
        onSelectMovie={openMovieDetail}
      />
      {movieDetail && (
        <MovieDetailModal movie={movieDetail} onClose={closeMovieDetail} />
      )}
    </>
  );
}

export default App;
