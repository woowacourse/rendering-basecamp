import { moviesApi } from "../../api/movies";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { MovieDetailResponse } from "@/types/MovieDetail.types";
import { IconButton } from "@/components/common/IconButton";
import { useMovieRating } from "@/hooks/useMovieRating";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = {
  movie: MovieDetailResponse;
};

const SCORE_TEXT: Record<number, string> = {
  2: "최악이에요",
  4: "별로예요",
  6: "보통이에요",
  8: "재미있어요",
  10: "명작이에요",
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.params!;

  try {
    const res = await moviesApi.getDetail(Number(id));
    const movie = res.data;
    return { props: { movie } };
  } catch (error) {
    console.error("Failed to fetch movie detail:", error);
    return { notFound: true };
  }
};

export default function MovieDetailPage({
  movie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { rating, setRating } = useMovieRating(movie?.id, movie?.title);

  const { title, genres, overview, vote_average, poster_path } = movie;

  const genreNames = genres.map((genre) => genre.name).join(", ");
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/original${poster_path}`
    : "/images/no_image.png";

  const handleStarClick = (score: number) => {
    setRating(score);
  };

  const router = useRouter();

  const handleNavigateBack = () => {
    router.back();
  };

  return (
    <div className="modal-background active">
      <Head>
        <title>{movie.title}</title>
        <meta name="description" content={movie.overview} />
        <meta property="og:title" content={movie.title} />
        <meta property="og:description" content={movie.overview} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="video.movie" />
        <meta
          property="og:url"
          content={`https://yourdomain.com/detail/${movie.id}`}
        />
      </Head>
      <div className="modal">
        <div className="modal-header">
          <h1 className="modal-title">{title}</h1>
          <IconButton
            src="/images/modal_button_close.png"
            width="24"
            height="24"
            onClick={handleNavigateBack}
            className="modal-close-btn"
          />
        </div>

        <div className="modal-container">
          <img src={imageUrl} alt={title} className="modal-image" />
          <div className="modal-description">
            <div className="movie-info-line">
              <span className="movie-meta">{genreNames}</span>
              <div className="movie-rating">
                <img src="/images/star_filled.png" width="16" height="16" />
                <span className="rating-value">{vote_average.toFixed(1)}</span>
              </div>
            </div>

            <div className="overview-section">
              <p className="overview-text">
                {overview || "줄거리 정보가 없습니다."}
              </p>
            </div>

            <div className="my-rating-section">
              <div className="rating-header">
                <span className="rating-label">내 별점</span>
                <div className="star-rating">
                  {Array.from({ length: 5 }, (_, index) => {
                    const starScore = (index + 1) * 2;
                    const isFilled = starScore <= rating;

                    return (
                      <IconButton
                        key={index}
                        src={
                          isFilled
                            ? "/images/star_filled.png"
                            : "/images/star_empty.png"
                        }
                        width="24"
                        height="24"
                        onClick={() => handleStarClick(starScore)}
                        alt={`Star ${index + 1}`}
                      />
                    );
                  })}
                  <span className="rating-text">
                    {rating} {SCORE_TEXT[rating] ?? "별점을 남겨주세요"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
