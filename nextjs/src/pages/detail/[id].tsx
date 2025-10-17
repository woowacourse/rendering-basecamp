import Head from "next/head";
import { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { Footer } from "@/components/Footer";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { moviesApi } from "@/api/movies";

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
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        <link rel="icon" href="/favicon.ico" />
      </Head>

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
