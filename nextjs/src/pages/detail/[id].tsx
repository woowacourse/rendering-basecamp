import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { OGMetaTags } from "@/components/OGMetaTags";
import { getMovieDetailUrl, getTMDBImageUrl } from "@/constants/urls";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import type { MovieItem } from "@/types/Movie.types";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSideProps } from "next";
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
      <OGMetaTags
        title={movieDetail.title}
        description={movieDetail.overview}
        url={getMovieDetailUrl(movieDetail.id)}
        type="video.movie"
        image={getTMDBImageUrl(movieDetail.poster_path, "original")}
        movieDuration={
          movieDetail.runtime ? `${movieDetail.runtime * 60}` : undefined
        }
        movieReleaseDate={movieDetail.release_date}
        movieTags={movieDetail.genres.map((genre) => genre.name).join(", ")}
      />
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
