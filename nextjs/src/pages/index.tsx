import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieDetailModalLoader } from "@/components/MovieDetailModalLoader";
import { MovieList } from "@/components/MovieList";
import { SeoHead } from "@/components/SeoHead";
import { MovieItem } from "@/types/Movie.types";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface MoviesPageProps {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse | null;
}

export default function Home({ movies, movieDetail }: MoviesPageProps) {
  const router = useRouter();
  const { movieId } = router.query;

  const handleCloseModal = () => {
    router.push("/", undefined, { shallow: true });
  };

  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  const featured = movies[0];

  return (
    <>
      {!movieDetail ? (
        <SeoHead
          title="인기 영화 추천"
          description="지금 인기 있는 영화들을 만나보세요."
          image={`https://image.tmdb.org/t/p/w1280${featured.backdrop_path}`}
          url="https://rendering-basecamp-p53f-j8uw934wj-horse6953-7600s-projects.vercel.app/"
        />
      ) : (
        <SeoHead
          title={movieDetail.title}
          description={movieDetail.overview}
          image={`https://image.tmdb.org/t/p/w1280${movieDetail.backdrop_path}`}
          url={`https://rendering-basecamp-p53f-j8uw934wj-horse6953-7600s-projects.vercel.app//detail/${movieDetail.id}`}
        />
      )}

      <div id="wrap">
        <Header featuredMovie={featured} />
        <MovieList movies={movies} />
        <Footer />

        {movieId && typeof movieId === "string" && (
          <MovieDetailModalLoader
            movieId={parseInt(movieId)}
            close={handleCloseModal}
          />
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<MoviesPageProps> = async (
  context
) => {
  try {
    const movieResponse = await moviesApi.getPopular();
    const movies = movieResponse.data.results;

    const { movieId } = context.query;
    let movieDetail: MovieDetailResponse | null = null;

    if (movieId && typeof movieId === "string") {
      try {
        const movieDetailResponse = await moviesApi.getDetail(
          parseInt(movieId)
        );
        movieDetail = movieDetailResponse.data;
      } catch (error) {
        console.error("영화 상세 정보 가져오기 실패:", error);
      }
    }
    return {
      props: {
        movies,
        movieDetail,
      },
    };
  } catch (error) {
    console.error("영화 데이터 패칭 실패:", error);
    return {
      props: {
        movies: [],
      },
    };
  }
};
