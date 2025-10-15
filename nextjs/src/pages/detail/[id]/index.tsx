import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { SeoHead } from "@/components/SeoHead";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieItem;
}

export default function MovieDetailPage({
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const ogImage = `https://image.tmdb.org/t/p/w1280${movieDetail.backdrop_path}`;
  const ogUrl = `https://my-movie-app.com/detail/${movieDetail.id}`;

  return (
    <>
      <SeoHead
        title={movieDetail.title}
        description={movieDetail.overview}
        image={ogImage}
        url={ogUrl}
      />

      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
        <DetailPageOpenModal />
      </div>
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();
  const { id: movieId } = router.query;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetail = await moviesApi.getDetail(Number(movieId));
      openMovieDetailModal(movieDetail.data);
    })();
  }, [movieId, openMovieDetailModal]);

  return null;
}

/**
 * ✅ 서버사이드 렌더링 (SSR)
 *  - 인기 영화 목록 + 특정 영화 상세 정보를 함께 패칭
 */

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    const [popularRes, detailRes] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(id)),
    ]);

    const movies = popularRes.data.results;
    const movieDetail = detailRes.data;

    return {
      props: {
        movies,
        movieDetail,
      },
    };
  } catch (error) {
    console.error("영화 데이터 패칭 실패:", error);
    return {
      props: {
        movies: [],
        movieDetail: null,
      },
    };
  }
};
