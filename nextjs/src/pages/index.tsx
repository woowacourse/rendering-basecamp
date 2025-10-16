import { moviesApi } from "@/api/movies";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { MovieItem } from "@/types/Movie.types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps = (async () => {
  const moviesRes = await moviesApi.getPopular();
  const movies: MovieItem[] = moviesRes.data.results;

  return { props: { movies } };
}) satisfies GetServerSideProps<{
  movies: MovieItem[];
}>;

export default function Home({
  movies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div id="wrap">
        <Header featuredMovie={movies[0]} />
        <MovieList movies={movies} />
        <Footer />
      </div>
    </>
  );
}
