import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Header } from "../../components/Header";
import { MovieList } from "../../components/MovieList";
import { Footer } from "../../components/Footer";
import { MovieDetailModal } from "../../components/MovieDetailModal";
import { moviesApi } from "../../api/movies";
import { MovieItem } from "../../types/Movie.types";
import { MovieDetailResponse } from "../../types/MovieDetail.types";

interface DetailPageProps {
  movies: MovieItem[];
  movieDetail: MovieDetailResponse;
}

export default function DetailPage({ movies, movieDetail }: DetailPageProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>{movieDetail.title} - 영화 리뷰</title>
        <meta name="description" content={movieDetail.overview} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph 메타태그 */}
        <meta property="og:title" content={movieDetail.title} />
        <meta property="og:description" content={movieDetail.overview} />
        <meta
          property="og:image"
          content={
            movieDetail.poster_path
              ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
              : "/images/no_image.png"
          }
        />
        <meta
          property="og:url"
          content={`${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"
          }/detail/${movieDetail.id}`}
        />
        <meta property="og:type" content="movie" />

        {/* Twitter Card 메타태그 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={movieDetail.title} />
        <meta name="twitter:description" content={movieDetail.overview} />
        <meta
          name="twitter:image"
          content={
            movieDetail.poster_path
              ? `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`
              : "/images/no_image.png"
          }
        />
      </Head>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
        <MovieDetailModal movie={movieDetail} onClose={handleClose} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<DetailPageProps> = async (
  context
) => {
  const { movieId } = context.params!;

  try {
    // 병렬로 영화 목록과 상세 정보를 가져옵니다
    const [moviesResponse, movieDetailResponse] = await Promise.all([
      moviesApi.getPopular(),
      moviesApi.getDetail(Number(movieId)),
    ]);

    const movies = moviesResponse.data.results;
    const movieDetail = movieDetailResponse.data;

    return {
      props: {
        movies,
        movieDetail,
      },
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      notFound: true,
    };
  }
};
