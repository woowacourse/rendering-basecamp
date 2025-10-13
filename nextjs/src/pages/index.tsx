import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import type { MovieItem } from "@/types/Movie.types";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import { getPageMetadata } from "@/utils/metadata";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { overlay } from "overlay-kit";
import { useEffect, useRef, useState } from "react";

interface MovieHomePageProps {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
}

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

    if (isModalOpeningRef.current) return;

    // 외부 링크 접근
    if (currentMovieDetail) {
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
    else if (movieId && !currentMovieDetail) {
      moviesApi
        .getDetail(Number(movieId))
        .then((response) => {
          setCurrentMovieDetail(response.data);

          isModalOpeningRef.current = true;
          return openMovieDetailModal(response.data);
        })
        .then(() => {
          setCurrentMovieDetail(undefined);
        })
        .finally(() => {
          isModalOpeningRef.current = false;
          router.push("/", undefined, { shallow: true });
        });
    }
  }, [currentMovieDetail, router.query.movieId, openMovieDetailModal, router]);

  const {
    pageTitle,
    pageDescription,
    ogImageUrl,
    ogType,
    ogImageWidth,
    ogImageHeight,
    ogUrl,
  } = getPageMetadata(currentMovieDetail, movies[0]);

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
