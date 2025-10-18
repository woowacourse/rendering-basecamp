import { moviesApi } from "@/api/movies";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import { useRouter } from "next/router";
import Head from "next/head";

interface MovieDetailPageProps {
  movieDetail: MovieDetailResponse;
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async context => {
  try {
    const movieId = context.params?.movieId;
    const response = await moviesApi.getDetail(Number(movieId));
    const movieDetail = response.data;

    return {
      props: {
        movieDetail,
      },
    };
  } catch (error) {
    console.error(error ?? "영화 상세 정보를 불러오는데 실패했습니다.");
    return {
      notFound: true,
    };
  }
};

export default function MovieDetailPage({
  movieDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/detail/${movieDetail.id}`;
  const imageUrl = movieDetail.poster_path
    ? `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`
    : "";

  return (
    <>
      <Head>
        <title>{movieDetail.title}</title>
        <meta property="og:title" content={movieDetail.title} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={movieDetail.overview} />
        <meta property="og:url" content={pageUrl} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
      </Head>
      <MovieDetailModal movie={movieDetail} onClose={() => router.back()} />
    </>
  );
}
