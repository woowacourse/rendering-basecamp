import { Header } from "../components/Header";
import { MovieList } from "../components/MovieList";
import { Footer } from "../components/Footer";
import { SEOHead } from "../components/common/SEOHead";
import { moviesApi } from "../api/movies";
import type { MovieItem } from "../types/Movie.types";
import type { GetServerSideProps } from "next";

interface MovieHomePageProps {
  movies: MovieItem[];
}

export default function MovieHomePage({ movies }: MovieHomePageProps) {
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
        ogUrl="https://rendering-basecamp2.vercel.app/"
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
> = async () => {
  try {
    const response = await moviesApi.getPopular();
    const movies = response.data.results;

    return {
      props: {
        movies,
      },
    };
  } catch {
    return {
      props: {
        movies: [],
      },
    };
  }
};
