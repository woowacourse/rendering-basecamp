import Head from "next/head";
import Home from '../index';
import {useEffect, useRef} from "react";
import {moviesApi} from "@/api/movies";
import {useMovieDetailModal} from "@/hooks/useMovieDetailModal";
import {MovieItem} from "@/types/Movie.types";
import {GetServerSideProps} from "next";
import {MovieDetailResponse} from "@/types/MovieDetail.types";

interface DetailProps {
  movies: MovieItem[];
  detail: MovieDetailResponse | null;
  error: string | null;
}

export const getServerSideProps: GetServerSideProps<DetailProps> = async (context) => {
  const {id} = context.params as {id: string};

  try {
    const moviesResponse = await moviesApi.getPopular();
    const movieDetail = await moviesApi.getDetail(Number(id));

    return {
      props: {
        movies: moviesResponse.data.results,
        detail: movieDetail.data,
        error: null
      }
    };
  } catch (error) {
    console.error('영화 데이터 fetch 실패:', error);
    return {
      props: {
        movies: [],
        detail: null,
        error: '영화 정보를 불러오는데 실패했습니다.'
      }
    }
  }
}

export default function MovieDetailPage({movies, detail, error}: DetailProps) {
  return (
    <>
      <Head>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="인기 영화 목록"/>
        <meta property="og:url" content={`https://rendering-basecamp-shinjungoh.vercel.app/detail/${detail?.id}`}/>
        <meta property="og:title" content={`${detail?.title}`}/>
        <meta property="og:description" content={`${detail?.overview}`}/>
        <meta property="og:image" content={`${detail?.poster_path}`}/>
        <meta property="og:locale" content="ko_KR"/>
      </Head>
      <Home movies={movies} error={error}/>
      <DetailPageOpenModal detail={detail}/>
    </>
  );
}

function DetailPageOpenModal({detail}: {
  detail: MovieDetailResponse | null;
}) {
  const {openMovieDetailModal} = useMovieDetailModal();
  const onceRef = useRef(false);

  useEffect(() => {
    if (detail == null || onceRef.current) {
      return;
    }

    onceRef.current = true;
    openMovieDetailModal(detail);
  }, [detail, openMovieDetailModal]);

  return null;
}
