import Home from '../index';
import {useEffect, useRef} from "react";
import {moviesApi} from "@/api/movies";
import {useMovieDetailModal} from "@/hooks/useMovieDetailModal";
import {useRouter} from "next/router";
import {MovieItem} from "@/types/Movie.types";
import {GetServerSideProps} from "next";

interface HomeProps {
  movies: MovieItem[];
  error: string | null;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const response = await moviesApi.getPopular();
    return {
      props: {
        movies: response.data.results,
        error: null
      }
    };
  } catch (error) {
    console.error('영화 데이터 fetch 실패:', error);
    return {
      props: {
        movies: [],
        error: '영화 정보를 불러오는데 실패했습니다.'
      }
    }
  }
}

export default function MovieDetailPage({movies, error}: HomeProps) {
  return (
    <>
      <Home movies={movies} error={error} />
      <DetailPageOpenModal />
    </>
  );
}

function DetailPageOpenModal() {
  const router = useRouter();
  const {movieId} = router.query;
  const {openMovieDetailModal} = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (movieId == null || onceRef.current) {
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
