import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { isAxiosError } from "axios";
import { moviesApi } from "@/api/movies";
import { MovieHome } from "@/components/MovieHome";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import { PageHead } from "@/components/PageHead";
import { getSiteUrl } from "@/lib/siteUrl";
import { movieImageUrl } from "@/utils/movieImage";
import type { MovieItem } from "@/types/Movie.types";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";

interface DetailProps {
  movie: MovieDetailResponse;
  movies: MovieItem[];
  siteUrl: string;
}

export const getServerSideProps: GetServerSideProps<DetailProps, { id: string }> = async ({ params, req, res }) => {
  const id = params?.id;
  if (!id || !/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
    return { notFound: true };
  }

  // 배경 목록 조회가 실패해도 요청한 영화 상세 정보는 보여줍니다.
  const [detail, popular] = await Promise.allSettled([
    moviesApi.getDetail(Number(id)),
    moviesApi.getPopular(),
  ]);

  if (detail.status === "rejected") {
    if (isAxiosError(detail.reason) && detail.reason.response?.status === 404) {
      return { notFound: true };
    }
    // API 장애는 404로 처리하지 않고 Next.js의 500 페이지로 전달합니다.
    throw new Error("영화 상세 정보를 불러오는데 실패했습니다.");
  }

  if (popular.status === "fulfilled") {
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  } else {
    res.setHeader("Cache-Control", "no-store");
  }

  return {
    props: {
      movie: detail.value.data,
      movies: popular.status === "fulfilled" ? popular.value.data.results : [],
      siteUrl: getSiteUrl(req),
    },
  };
};

export default function MovieDetailPage({ movie, movies, siteUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const image = movieImageUrl(movie.backdrop_path || movie.poster_path, "w1280");

  return (
    <>
      <PageHead
        title={`${movie.title} | 영화 리뷰`}
        description={movie.overview || `${movie.title}의 영화 정보와 평점을 확인하고 나만의 별점을 남겨보세요.`}
        image={new URL(image, siteUrl).href}
        imageAlt={movie.title}
        url={`${siteUrl}/detail/${movie.id}`}
        type="video.movie"
      />
      <MovieHome movies={movies} />
      {/* 효과로 열지 않고 첫 HTML부터 상세 내용을 렌더링합니다. */}
      <MovieDetailModal key={movie.id} movie={movie} />
    </>
  );
}
