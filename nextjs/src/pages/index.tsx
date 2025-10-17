import Head from "next/head";
import { GetServerSideProps } from "next";
import { moviesApi } from "@/api/movies";
import { MovieItem } from "@/types/Movie.types";
import { Header } from "@/components/Header";
import { MovieList } from "@/components/MovieList";
import { Footer } from "@/components/Footer";

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
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        <link rel="icon" href="/favicon.ico" />
      </Head>

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
