import { isAxiosError } from "axios";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MovieHome } from "../../components/MovieHome";
import { moviesApi } from "../../api/movies";
import { CDN_CACHE_CONTROL } from "../../constants/cache";
import { MovieDetailModal } from "../../components/MovieDetailModal";
import type { MovieItem } from "../../types/Movie.types";
import type { MovieDetailResponse } from "../../types/MovieDetail.types";

interface Props {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
  pageUrl: string;
}

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

const getOgImageUrl = (movie: MovieDetailResponse) => {
  if (movie.backdrop_path)
    return `${TMDB_IMAGE_URL}/w780${movie.backdrop_path}`;
  if (movie.poster_path) return `${TMDB_IMAGE_URL}/w500${movie.poster_path}`;
  return null;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  req,
  res,
  resolvedUrl,
}) => {
  const id = Number(params?.id);

  if (!Number.isInteger(id) || id <= 0) {
    return { notFound: true };
  }

  const [popular, detail] = await Promise.allSettled([
    moviesApi.getPopular(),
    moviesApi.getDetail(id),
  ]);

  if (detail.status === "rejected") {
    const error = detail.reason;
    if (isAxiosError(error) && error.response?.status === 404) {
      return { notFound: true };
    }
    throw error;
  }

  const movies =
    popular.status === "fulfilled" ? popular.value.data.results : [];

  if (popular.status === "fulfilled") {
    res.setHeader("Cache-Control", CDN_CACHE_CONTROL);
  }

  return {
    props: {
      movies,
      movieDetail: detail.value.data,
      pageUrl: `https://${req.headers.host}${resolvedUrl}`,
    },
  };
};

export default function MovieDetailPage({
  movies,
  movieDetail,
  pageUrl,
}: Props) {
  const title = `${movieDetail.title} | Movielist`;
  const description =
    movieDetail.overview || `${movieDetail.title}의 상세 정보를 확인해 보세요.`;
  const ogImageUrl = getOgImageUrl(movieDetail);
  const router = useRouter();

  const handleModalClose = () => {
    router.push("/", undefined, { scroll: false });
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Movielist" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <MovieHome movies={movies} />
      <MovieDetailModal movie={movieDetail} onClose={handleModalClose} />
    </>
  );
}
