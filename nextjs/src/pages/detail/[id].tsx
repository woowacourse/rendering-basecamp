import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import MetaTags from "@/components/common/MetaTags";
import Home from "..";
import { moviesApi } from "@/api/movies";
import { MovieDetailResponse } from "@/types/MovieDetail.types";

interface MovieDetailPageProps {
  movie: MovieDetailResponse;
}
export default function MovieDetailPage({ movie }: MovieDetailPageProps) {
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (!onceRef.current) {
      openMovieDetailModal(movie);
      onceRef.current = true;
    }
  }, [movie, openMovieDetailModal]);
  console.log(movie.poster_path);

  return (
    <>
      <MetaTags
        title={`${movie.title} | 영화 리뷰`}
        description={movie.overview}
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : `https://rendering-basecamp-blue.vercel.app/images/logo.png`
        }
        url={`https://rendering-basecamp-blue.vercel.app/detail/${movie.id}`}
      />
      <Home />
    </>
  );
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const { data } = await moviesApi.getDetail(Number(id));

    return {
      props: {
        movie: {
          id: data.id,
          title: data.title,
          overview: data.overview ?? "",
          poster_path: data.poster_path ?? "/logo.png",
        },
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
