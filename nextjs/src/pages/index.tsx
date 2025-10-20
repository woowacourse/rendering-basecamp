import { GetServerSideProps } from "next";
import { moviesApi } from "@/api/movies";
import { MovieItem } from "@/types/Movie.types";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { Footer } from "@/components/Footer";
import { MetaTags } from "@/components/common/MetaTags";

type HomeProps = {
  popularMovies: MovieItem[];
  siteUrl: string;
};

export default function Home({ popularMovies, siteUrl }: HomeProps) {
  const title = "지금 인기 있는 영화";
  const description = "지금 가장 인기 있는 영화를 만나보세요!";
  const image = `${siteUrl}/images/og-image.jpg`;

  if (!popularMovies || popularMovies.length === 0) {
    return <div>영화 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      <MetaTags
        title={title}
        description={description}
        url={siteUrl}
        image={image}
      />

      <div id="wrap">
        <Header featuredMovie={popularMovies[0]} />
        <MovieList movies={popularMovies} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const host = context.req.headers.host;
  const protocol =
    (context.req.headers["x-forwarded-proto"] as string) || "http";
  const siteUrl = `${protocol}://${host}`;

  try {
    const res = await moviesApi.getPopular();
    return {
      props: {
        popularMovies: res.data.results,
        siteUrl,
      },
    };
  } catch {
    return {
      props: {
        popularMovies: [],
        siteUrl,
      },
    };
  }
};
