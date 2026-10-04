import type { GetServerSideProps } from "next";
import { moviesApi } from "../../api/movies";
import type { MovieDetailPageProps } from "../../screens/MovieDetailPage";

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async ({ params }) => {
  const movieId = Number(params?.movieId);
  const [popularResponse, detailResponse] = await Promise.all([
    moviesApi.getPopular(),
    moviesApi.getDetail(movieId),
  ]);

  return {
    props: {
      movies: popularResponse.data.results,
      movieDetail: detailResponse.data,
    },
  };
};

export { default } from "../../screens/MovieDetailPage";
