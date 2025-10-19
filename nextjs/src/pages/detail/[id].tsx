import { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { Footer } from "@/components/Footer";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { moviesApi } from "@/api/movies";
import { MetaTags } from "@/components/common/MetaTags";

type DetailPageProps = {
  popularMovies: MovieItem[];
  movieDetail: MovieDetailResponse | null;
  siteUrl: string;
};

export default function MovieDetailPage({
  popularMovies,
  movieDetail,
  siteUrl,
}: DetailPageProps) {
  const title = movieDetail ? `${movieDetail.title} | 인기 영화` : "영화 상세";
  const description = movieDetail?.overview
    ? movieDetail.overview.slice(0, 100)
    : "영화 상세 정보를 확인해보세요!";
  const image = movieDetail?.poster_path
    ? `https://image.tmdb.org/t/p/w780${movieDetail.poster_path}`
    : `${siteUrl}/images/og-image.jpg`;
  const url = `${siteUrl}/detail/${movieDetail?.id ?? ""}`;

  if (!popularMovies || popularMovies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <MetaTags
        title={title}
        description={description}
        url={url}
        image={image}
      />

      <DetailPageOpenModal movieDetail={movieDetail} />

      <div id="wrap">
        {popularMovies.length > 0 && (
          <Header featuredMovie={popularMovies[0]} />
        )}
        <MovieList movies={popularMovies} />
        <Footer />
      </div>
    </>
  );
}

function DetailPageOpenModal({
  movieDetail,
}: {
  movieDetail: MovieDetailResponse | null;
}) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (!movieDetail || onceRef.current) return;
    onceRef.current = true;
    openMovieDetailModal(movieDetail);
  }, [movieDetail, openMovieDetailModal]);

  return null;
}

export const getServerSideProps: GetServerSideProps<DetailPageProps> = async (
  context
) => {
  const { id } = context.params!;

  const host = context.req.headers.host;
  const protocol =
    (context.req.headers["x-forwarded-proto"] as string) || "http";
  const siteUrl = `${protocol}://${host}`;

  try {
    const [popularRes, detailRes] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(id)),
    ]);

    return {
      props: {
        popularMovies: popularRes.data.results,
        movieDetail: detailRes.data,
        siteUrl,
      },
    };
  } catch (error) {
    console.error("영화 정보를 불러오는데 실패했습니다.", error);
    return {
      props: {
        popularMovies: [],
        movieDetail: null,
        siteUrl,
      },
    };
  }
};
