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

interface MovieHomePageProps {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

export default function MovieHomePage({ movies, movieDetail }: MovieHomePageProps) {
  const router = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();
  const isModalOpeningRef = useRef(false);

  useEffect(() => {
    const movieId = router.query.movieId as string | undefined;

    // 케이스 1: props로 movieDetail이 전달된 경우 (외부 링크 접근)
    if (movieDetail && !isModalOpeningRef.current) {
      isModalOpeningRef.current = true;

      openMovieDetailModal(movieDetail)
        .then(() => {
          router.push('/', undefined, { shallow: true });
        })
        .finally(() => {
          isModalOpeningRef.current = false;
        });
    }
    // 케이스 2: movieId는 있지만 movieDetail이 없는 경우 (앱 내 클릭 - shallow routing)
    else if (movieId && !movieDetail && !isModalOpeningRef.current) {
      isModalOpeningRef.current = true;

      moviesApi.getDetail(Number(movieId))
        .then((response) => {
          return openMovieDetailModal(response.data);
        })
        .then(() => {
          router.push('/', undefined, { shallow: true });
        })
        .catch((error) => {
          console.error("영화 상세 정보를 불러오는데 실패했습니다:", error);
          router.push('/', undefined, { shallow: true });
        })
        .finally(() => {
          isModalOpeningRef.current = false;
        });
    } else if (!movieId) {
      isModalOpeningRef.current = false;
    }
  }, [movieDetail, router.query.movieId, openMovieDetailModal, router]);
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  // movieDetail이 있으면 해당 영화의 메타 태그, 없으면 기본 메타 태그
  const pageTitle = movieDetail
    ? `${movieDetail.title} - Movie Database`
    : "인기 영화 - Movie Database";

  const pageDescription = movieDetail
    ? movieDetail.overview || `${movieDetail.title}의 상세 정보`
    : "최신 인기 영화 정보를 확인하세요. TMDB 기반 영화 데이터베이스";

  const ogImageUrl = movieDetail?.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : movies[0]?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`
    : `https://image.tmdb.org/t/p/original${movies[0]?.poster_path}`;

  const ogType = movieDetail ? "video.movie" : "website";
  const ogImageWidth = movieDetail ? "1000" : "1280";
  const ogImageHeight = movieDetail ? "1500" : "720";
  const ogUrl = movieDetail
    ? `https://rendering-basecamp-git-guesung-gueit214s-projects.vercel.app/?movieId=${movieDetail.id}`
    : "https://rendering-basecamp-git-guesung-gueit214s-projects.vercel.app/";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={pageDescription}
          key="description"
        />
        <meta
          property="og:url"
          content={ogUrl}
          key="og:url"
        />
        <meta
          property="og:title"
          content={pageTitle}
          key="og:title"
        />
        <meta
          property="og:description"
          content={pageDescription}
          key="og:description"
        />
        <meta property="og:type" content={ogType} key="og:type" />
        <meta property="og:image" content={ogImageUrl} key="og:image" />
        <meta property="og:image:width" content={ogImageWidth} key="og:image:width" />
        <meta property="og:image:height" content={ogImageHeight} key="og:image:height" />
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter:card"
        />
        <meta
          name="twitter:title"
          content={pageTitle}
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          content={pageDescription}
          key="twitter:description"
        />
        <meta name="twitter:image" content={ogImageUrl} key="twitter:image" />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  MovieHomePageProps
> = async (context) => {
  const { movieId } = context.query;

  try {
    const moviesResponse = await moviesApi.getPopular();
    const movies = moviesResponse.data.results;

    // movieId가 있으면 해당 영화 상세 정보도 가져옴
    if (movieId && typeof movieId === 'string') {
      try {
        const movieDetailResponse = await moviesApi.getDetail(Number(movieId));
        return {
          props: {
            movies,
            movieDetail: movieDetailResponse.data,
          },
        };
      } catch (detailError) {
        console.error("영화 상세 정보를 불러오는데 실패했습니다:", detailError);
        // 상세 정보 로드 실패 시 기본 목록만 반환
        return {
          props: {
            movies,
          },
        };
      }
    }

    return {
      props: {
        movies,
      },
    };
  } catch (error) {
    console.error("영화 정보를 불러오는데 실패했습니다:", error);
    return {
      props: {
        movies: [],
      },
    };
  }
};
