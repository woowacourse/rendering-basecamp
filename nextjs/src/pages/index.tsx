import Head from "next/head";

import MovieHomePage from "./MovieHomePage";
import { GetServerSideProps } from "next";
import { moviesApi } from "@/api/movies";
import { MovieItem } from "@/types/Movie.types";

type HomeProps = {
  popularMovies: MovieItem[];
};

export default function Home({ popularMovies }: HomeProps) {
  return <MovieHomePage initialMovies={popularMovies} />;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const res = await moviesApi.getPopular();
    return {
      props: {
        popularMovies: res.data.results,
      },
    };
  } catch (e) {
    return {
      props: {
        popularMovies: [],
      },
    };
  }
};
