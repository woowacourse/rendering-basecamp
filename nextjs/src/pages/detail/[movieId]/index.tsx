import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import { moviesApi } from "@/api/movies";
import type { MovieItem } from "@/types/Movie.types";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { GetServerSideProps } from "next";

interface MovieDetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

export default function MovieDetailPage({
  movies,
  movieDetail,
}: MovieDetailPageProps) {
  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : undefined;
  const description =
    movieDetail.overview || `${movieDetail.title}의 상세 정보`;

  return (
    <>
      <Head>
        <title>{movieDetail.title} - Movie Database</title>
        <meta name="description" content={description} key="description" />
        <meta
          property="og:title"
          content={`${movieDetail.title} - Movie Database`}
          key="og:title"
        />
        <meta
          property="og:description"
          content={description}
          key="og:description"
        />
        <meta property="og:type" content="video.movie" key="og:type" />
        {imageUrl && (
          <meta property="og:image" content={imageUrl} key="og:image" />
        )}
        {imageUrl && (
          <meta property="og:image:width" content="1000" key="og:image:width" />
        )}
        {imageUrl && (
          <meta
            property="og:image:height"
            content="1500"
            key="og:image:height"
          />
        )}
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter:card"
        />
        <meta
          name="twitter:title"
          content={movieDetail.title}
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content={description}
          key="twitter:description"
        />
        {imageUrl && (
          <meta name="twitter:image" content={imageUrl} key="twitter:image" />
        )}
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

function DetailPageOpenModal({
  movieDetail,
}: {
  movieDetail: MovieDetailResponse;
}) {
  const router = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current === true) {
      return;
    }
    onceRef.current = true;
    openMovieDetailModal(movieDetail).then(() => {
      router.push('/');
    });
  }, [movieDetail, openMovieDetailModal, router]);

  return null;
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async (context) => {
  const { movieId } = context.params as { movieId: string };

  try {
    const [moviesResponse, movieDetailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    return {
      props: {
        movies: moviesResponse.data.results,
        movieDetail: movieDetailResponse.data,
      },
    };
  } catch (error) {
    console.error("영화 정보를 불러오는데 실패했습니다:", error);
    return {
      notFound: true,
    };
  }
};
