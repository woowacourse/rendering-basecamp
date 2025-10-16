import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { SEOHead } from "../components/common/SEOHead";
import { moviesApi } from "../api/movies";
import type { MovieItem } from "../types/Movie.types";
import type { GetServerSideProps } from "next";

interface MovieHomePageProps {
  movies: MovieItem[];
  currentUrl: string;
}

export default function MovieHomePage({
  movies,
  currentUrl,
}: MovieHomePageProps) {
  if (movies == null || movies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }
  const ogContent = "보고싶은 영화의 리뷰를 확인하세요";
  const ogImage = `https://image.tmdb.org/t/p/w1280${movies[0].poster_path}`;

  return (
    <>
      <SEOHead
        title="영화 리뷰"
        description={ogContent}
        ogType="video.movie"
        ogTitle="영화 리뷰"
        ogDescription={ogContent}
        ogImage={ogImage}
        ogUrl={currentUrl}
      />
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
  const protocol = context.req.headers["x-forwarded-proto"];
  const host = context.req.headers.host;
  const currentUrl = `${protocol}://${host}${context.resolvedUrl}`;

  try {
    const response = await moviesApi.getPopular();
    const movies = response.data.results;

    return {
      props: {
        movies,
        currentUrl,
      },
    };
  } catch {
    return {
      props: {
        movies: [],
        currentUrl,
      },
    };
  }
};
