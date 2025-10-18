import { moviesApi } from "@/api/movies";
import { OGMetaTags } from "@/components/OGMetaTags";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps } from "next";
import { MainContent } from "..";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { useEffect, useRef } from "react";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";

type Detail = {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
  currentUrl: string;
};

type DetailModal = {
  movieDetail: MovieDetailResponse;
};

function DetailPageOpenModal({ movieDetail }: DetailModal) {
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

function Detail({ movies, movieDetail, currentUrl }: Detail) {
  return (
    <>
      <OGMetaTags
        title={`${movieDetail.title} - 영화 리뷰`}
        description={movieDetail.overview}
        url={currentUrl}
        type="video.movie"
        movieDuration={
          movieDetail.runtime ? `${movieDetail.runtime * 60}` : undefined
        }
        movieReleaseDate={movieDetail.release_date}
        movieTags={movieDetail.genres.map((genre) => genre.name).join(", ")}
        image={`https://image.tmdb.org/t/p/original${movieDetail.poster_path}`}
      />
      <MainContent movies={movies} />
      <DetailPageOpenModal movieDetail={movieDetail} />
    </>
  );
}

export default Detail;

export const getServerSideProps: GetServerSideProps<Detail> = async (
  context
) => {
  const req = context.req;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const url = req.url;
  const currentUrl = `${protocol}://${host}${url}`;

  const { id } = context.params!;
  const movieId = id as string;

  try {
    const [popularResponse, detailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    const movies = popularResponse.data.results;
    const movieDetail = detailResponse.data;

    return { props: { movies, movieDetail, currentUrl } };
  } catch (error) {
    console.error("영화 정보를 불러오는 데 실패했습니다:", error);
    return { notFound: true };
  }
};
