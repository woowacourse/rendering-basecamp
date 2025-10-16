import { moviesApi } from "@/api/movies";
import { Loading } from "@/components/common/Loading";
import MetaTags from "@/components/common/MetaTags";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { usePopularMovies } from "@/hooks/queries/usePopularMovies";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{
  popularMovies: MovieItem[];
}> = async () => {
  const res = await moviesApi.getPopular();
  return {
    props: {
      popularMovies: res.data.results,
    },
  };
};

export default function Home({
  popularMovies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const imageUrl = popularMovies[0]?.poster_path
    ? `https://image.tmdb.org/t/p/original${popularMovies[0]?.poster_path}`
    : "/images/no_image.png";

  return (
    <div id="wrap">
      <MetaTags
        title="영화 리뷰 웹"
        description="영화 리뷰 웹 입니다"
        image={imageUrl}
        url="https://rendering-basecamp-blue.vercel.app/"
      />
      <Header featuredMovie={popularMovies[0]} />
      <MovieList movies={popularMovies} />
      <Footer />
    </div>
  );
}
