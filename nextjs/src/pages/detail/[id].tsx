import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import type { MovieItem } from "@/types/Movie.types";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useRef } from "react";

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

export default function MovieDetailPage({
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>{movieDetail.title}</title>
        <meta name="description" content={movieDetail.overview} />

        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content={movieDetail.title} />
        <meta property="og:description" content={movieDetail.overview} />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/w1200${movieDetail.poster_path}`}
        />
        <meta
          property="og:url"
          content={`https://rendering-basecamp-xi.vercel.app/detail/${movieDetail.id}`}
        />
        <meta property="og:site_name" content="영화 추천 사이트" />

        <meta
          property="video:duration"
          content={
            movieDetail.runtime ? `${movieDetail.runtime * 60}` : undefined
          }
        />
        <meta
          property="video:release_date"
          content={movieDetail.release_date}
        />
        <meta
          property="video:tag"
          content={movieDetail.genres.map((genre) => genre.name).join(", ")}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={movieDetail.title} />
        <meta name="twitter:description" content={movieDetail.overview} />
        <meta
          name="twitter:image"
          content={`https://image.tmdb.org/t/p/w1200${movieDetail.poster_path}`}
        />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
        <DetailPageOpenModal movieDetail={movieDetail} />
      </div>
    </>
  );
}

interface DetailPageOpenModalProps {
  movieDetail: MovieDetailResponse;
}

function DetailPageOpenModal({ movieDetail }: DetailPageOpenModalProps) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current === true) return;
    (async () => {
      onceRef.current = true;
      openMovieDetailModal(movieDetail);
    })();
  }, [movieDetail, openMovieDetailModal]);

  return null;
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async (context) => {
  const { id } = context.params!;
  const movieId = id as string;

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    const movies = popularResponse.data.results;
    const movieDetail = detailResponse.data;

    return { props: { movies, movieDetail } };
  } catch (error) {
    console.error("영화 정보를 불러오는 데 실패했습니다:", error);
    return { notFound: true };
  }
};
