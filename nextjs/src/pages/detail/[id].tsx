import MetaTags from "@/components/common/MetaTags";
import Home from "..";
import { moviesApi } from "@/api/movies";

interface MovieDetailPageProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
  };
}

export default function MovieDetailPage({ movie }: MovieDetailPageProps) {
  return (
    <>
      <MetaTags
        title={`${movie.title} | 영화 리뷰`}
        description={movie.overview}
        image={movie.poster_path}
        url={`https://yourdomain.com/detail/${movie.id}`}
      />
      <Home />
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.params;

  try {
    const { data } = await moviesApi.getDetail(Number(id));

    return {
      props: {
        movie: {
          id: data.id,
          title: data.title,
          overview: data.overview ?? "",
          poster_path: data.poster_path ?? "/logo.png",
        },
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
