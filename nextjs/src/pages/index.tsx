import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieList } from "@/components/MovieList";
import { useMovieDetailModal } from "@/hooks/useMovieDetailModal";
import type { MovieItem } from "@/types/Movie.types";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import { moviesApi } from "@/api/movies";
import type { GetServerSideProps } from "next";
import { buildOgMeta, OgMeta } from "@/utils/og";

type PageProps = {
  movies: MovieItem[];
  og: OgMeta;
};

export default function HomePage({ movies, og }: PageProps) {
  const router = useRouter();
  const { openMovieDetailModal } = useMovieDetailModal();
  const isOpeningRef = useRef(false);

  useEffect(() => {
    const movieId = router.query.movieId as string | undefined;
    if (!movieId || isOpeningRef.current) return;

    isOpeningRef.current = true;
    moviesApi
      .getDetail(Number(movieId))
      .then(({ data }) => Promise.resolve(openMovieDetailModal(data)))
      .catch((e) => console.error("open modal (shallow) failed:", e))
      .finally(() => {
        isOpeningRef.current = false;
        router.replace("/", undefined, { shallow: true });
      });
  }, [router.query.movieId, openMovieDetailModal, router]);

  if (!movies?.length) return <div>영화 정보를 불러오는데 실패했습니다.</div>;

  const featured = movies[0];

  return (
    <>
      <Head>
        <title>{og.pageTitle}</title>
        <meta name="description" content={og.pageDescription} />

        <meta property="og:url" content={og.ogUrl} />
        <meta property="og:title" content={og.pageTitle} />
        <meta property="og:description" content={og.pageDescription} />
        <meta property="og:type" content={og.ogType} />
        {og.ogImageUrl && <meta property="og:image" content={og.ogImageUrl} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={og.pageTitle} />
        <meta name="twitter:description" content={og.pageDescription} />
        {og.ogImageUrl && <meta name="twitter:image" content={og.ogImageUrl} />}
      </Head>

      <div id="wrap">
        <Header featuredMovie={featured} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  movies: MovieItem[];
  og: OgMeta;
  movieDetail?: MovieDetailResponse;
}> = async (ctx) => {
  try {
    const popularRes = await moviesApi.getPopular();
    const movies = popularRes.data.results as MovieItem[];
    const raw = ctx.query.movieId;
    const movieId = typeof raw === "string" ? Number(raw) : NaN;

    const isValidId = Number.isFinite(movieId) && movieId > 0;

    const movieDetail: MovieDetailResponse | undefined = isValidId
      ? await moviesApi
          .getDetail(movieId)
          .then((r) => r.data)
          .catch(() => undefined)
      : undefined;

    const origin = "https://vercel.com/yeji0214s-projects/rendering-basecamp";
    const path = ctx.resolvedUrl || "/";

    const og = buildOgMeta({ origin, path, detail: movieDetail });

    return {
      props: {
        movies,
        ...(movieDetail ? { movieDetail } : {}),
        og,
      },
    };
  } catch (e) {
    const origin = "https://vercel.com/yeji0214s-projects/rendering-basecamp";
    const og = buildOgMeta({ origin, path: "/" });
    return { props: { movies: [], og } };
  }
};
