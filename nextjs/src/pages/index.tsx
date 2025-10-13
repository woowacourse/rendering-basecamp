import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import type { MovieItem } from "@/types/Movie.types";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { overlay } from "overlay-kit";
import { useEffect, useRef, useState } from "react";

interface MovieHomePageProps {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

interface PageMetadata {
  pageTitle: string;
  pageDescription: string;
  ogImageUrl: string;
  ogType: string;
  ogImageWidth: string;
  ogImageHeight: string;
  ogUrl: string;
}

const getPageMetadata = (
  currentMovieDetail: MovieDetailResponse | undefined,
  movies: MovieItem[]
): PageMetadata => {
  if (currentMovieDetail) {
    return {
      pageTitle: `${currentMovieDetail.title} - Movie Database`,
      pageDescription:
        currentMovieDetail.overview || `${currentMovieDetail.title}의 상세 정보`,
      ogImageUrl: `https://image.tmdb.org/t/p/original${currentMovieDetail.poster_path}`,
      ogType: "video.movie",
      ogImageWidth: "1000",
      ogImageHeight: "1500",
      ogUrl: `https://rendering-basecamp-git-guesung-gueit214s-projects.vercel.app/?movieId=${currentMovieDetail.id}`,
    };
  }

  return {
    pageTitle: "인기 영화 - Movie Database",
    pageDescription: "최신 인기 영화 정보를 확인하세요. TMDB 기반 영화 데이터베이스",
    ogImageUrl: movies[0]?.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`
      : `https://image.tmdb.org/t/p/original${movies[0]?.poster_path}`,
    ogType: "website",
    ogImageWidth: "1280",
    ogImageHeight: "720",
    ogUrl: "https://rendering-basecamp-git-guesung-gueit214s-projects.vercel.app/",
  };
};

export default function MovieHomePage({
  movies,
  movieDetail,
}: MovieHomePageProps) {
  const router = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();
  const isModalOpeningRef = useRef(false);
  const [currentMovieDetail, setCurrentMovieDetail] = useState<
    MovieDetailResponse | undefined
  >(movieDetail);

  useEffect(() => {
    const movieId = router.query.movieId as string | undefined;

    // 외부 링크 접근
    if (currentMovieDetail && !isModalOpeningRef.current) {
      isModalOpeningRef.current = true;

      openMovieDetailModal(currentMovieDetail)
        .then(() => {
          setCurrentMovieDetail(undefined);
        })
        .finally(() => {
          isModalOpeningRef.current = false;
          router.push("/", undefined, { shallow: true });
        });
    }
    // 앱 내 클릭 - shallow routing
    else if (movieId && !currentMovieDetail && !isModalOpeningRef.current) {
      isModalOpeningRef.current = true;

      moviesApi
        .getDetail(Number(movieId))
        .then((response) => {
          setCurrentMovieDetail(response.data);
          return openMovieDetailModal(response.data);
        })
        .then(() => {
          setCurrentMovieDetail(undefined);
        })
        .catch((error) => {
          console.error("영화 상세 정보를 불러오는데 실패했습니다:", error);
        })
        .finally(() => {
          router.push("/", undefined, { shallow: true });
          isModalOpeningRef.current = false;
        });
    }
  }, [currentMovieDetail, router.query.movieId, openMovieDetailModal, router]);

  const pageTitle = currentMovieDetail
    ? `${currentMovieDetail.title} - Movie Database`
    : "인기 영화 - Movie Database";

  const pageDescription = currentMovieDetail
    ? currentMovieDetail.overview || `${currentMovieDetail.title}의 상세 정보`
    : "최신 인기 영화 정보를 확인하세요. TMDB 기반 영화 데이터베이스";

  const ogImageUrl = currentMovieDetail?.poster_path
    ? `https://image.tmdb.org/t/p/original${currentMovieDetail.poster_path}`
    : movies[0]?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`
    : `https://image.tmdb.org/t/p/original${movies[0]?.poster_path}`;

  const ogType = currentMovieDetail ? "video.movie" : "website";
  const ogImageWidth = currentMovieDetail ? "1000" : "1280";
  const ogImageHeight = currentMovieDetail ? "1500" : "720";
  const ogUrl = currentMovieDetail
    ? `https://rendering-basecamp-git-guesung-gueit214s-projects.vercel.app/?movieId=${currentMovieDetail.id}`
    : "https://rendering-basecamp-git-guesung-gueit214s-projects.vercel.app/";

  if (movies === null || movies.length === 0)
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} key="description" />
        <meta property="og:url" content={ogUrl} key="og:url" />
        <meta property="og:title" content={pageTitle} key="og:title" />
        <meta
          property="og:description"
          content={pageDescription}
          key="og:description"
        />
        <meta property="og:type" content={ogType} key="og:type" />
        <meta property="og:image" content={ogImageUrl} key="og:image" />
        <meta
          property="og:image:width"
          content={ogImageWidth}
          key="og:image:width"
        />
        <meta
          property="og:image:height"
          content={ogImageHeight}
          key="og:image:height"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter:card"
        />
        <meta name="twitter:title" content={pageTitle} key="twitter:title" />
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

    if (movieId && typeof movieId === "string") {
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
