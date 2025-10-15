import { useRouter } from "next/router";
import { useMovieDetailModal } from "../../hooks/useMovieDetailModal";
import { useEffect, useRef, useState } from "react";
import { moviesApi } from "../../api/movies";
import Head from "next/head";
import { Header } from "../../components/Header";
import { MovieList } from "../../components/MovieList";
import { Footer } from "../../components/Footer";
import { usePopularMovies } from "../../hooks/queries/usePopularMovies";
import { Loading } from "../../components/common/Loading";
import type { MovieDetailResponse } from "../../types/MovieDetail.types";

export default function MovieDetailPage() {
  const router = useRouter();
  const { movieId } = router.query;
  const { openMovieDetailModal } = useMovieDetailModal();
  const onceRef = useRef(false);
  const [movieDetail, setMovieDetail] = useState<MovieDetailResponse | null>(
    null
  );
  const { data: movies, isLoading } = usePopularMovies();

  useEffect(() => {
    if (!movieId || typeof movieId !== "string" || onceRef.current === true) {
      return;
    }
    (async () => {
      onceRef.current = true;
      const movieDetailData = await moviesApi.getDetail(Number(movieId));
      setMovieDetail(movieDetailData.data);
      await openMovieDetailModal(movieDetailData.data);
    })();
  }, [movieId, openMovieDetailModal]);

  if (isLoading === true) {
    return <Loading />;
  }

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const defaultTitle = "영화 상세 - 영화 리뷰";
  const defaultDescription = "영화 상세 정보를 확인하고 평점을 남겨보세요";
  const defaultImage = "/images/no_image.png";

  const movieTitle = movieDetail ? `${movieDetail.title}` : defaultTitle;
  const movieDescription = movieDetail
    ? movieDetail.overview ||
      `${movieDetail.title}에 대한 상세 정보를 확인하고 평점을 남겨보세요`
    : defaultDescription;
  const movieImage =
    movieDetail && movieDetail.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
      : defaultImage;
  const movieUrl = `https://your-domain.com/detail/${movieId}`;

  return (
    <>
      <Head>
        <title>{movieTitle}</title>
        <meta name="description" content={movieDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph 태그 */}
        <meta property="og:type" content="movie" />
        <meta property="og:title" content={movieTitle} />
        <meta property="og:description" content={movieDescription} />
        <meta property="og:image" content={movieImage} />
        <meta property="og:url" content={movieUrl} />
        <meta property="og:site_name" content="영화 리뷰" />

        {/* Twitter Card 태그 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={movieTitle} />
        <meta name="twitter:description" content={movieDescription} />
        <meta name="twitter:image" content={movieImage} />

        {movieDetail && (
          <>
            <meta
              property="movie:duration"
              content={`${movieDetail.runtime} minutes`}
            />
            <meta
              property="movie:release_date"
              content={movieDetail.release_date}
            />
            {movieDetail.genres.length > 0 && (
              <meta
                property="movie:genre"
                content={movieDetail.genres.map((g) => g.name).join(", ")}
              />
            )}
          </>
        )}
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
