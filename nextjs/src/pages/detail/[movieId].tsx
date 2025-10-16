import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import type { MovieDetailResponse } from "../../types/MovieDetail.types";
import { moviesApi } from "../../api/movies";
import { useMovieRating } from "../../hooks/useMovieRating";
import { IconButton } from "../../components/common/IconButton";
import { SEOHead } from "../../components/common/SEOHead";

interface MovieDetailPageProps {
  movie: MovieDetailResponse;
}

const SCORE_TEXT: Record<number, string> = {
  2: "최악이에요",
  4: "별로예요",
  6: "보통이에요",
  8: "재미있어요",
  10: "명작이에요",
};

export default function MovieDetailPage({ movie }: MovieDetailPageProps) {
  const router = useRouter();
  const { rating, setRating } = useMovieRating(movie.id, movie.title);

  const { title, genres, overview, vote_average, poster_path } = movie;

  const genreNames = genres.map((genre) => genre.name).join(", ");
  const imageUrl = `https://image.tmdb.org/t/p/original${poster_path}`;

  const ogImageUrl = `https://image.tmdb.org/t/p/w500${poster_path}`;

  const handleStarClick = (score: number) => {
    setRating(score);
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <>
      <SEOHead
        title={`${title} - 영화 상세정보`}
        description={overview || "영화 상세 정보"}
        ogType="video.movie"
        ogTitle={title}
        ogDescription={overview || "영화 상세 정보"}
        ogImage={ogImageUrl}
        ogUrl={`https://rendering-basecamp2.vercel.app/detail/${movie.id}`}
      />

      <div className="modal-background active">
        <div className="modal">
          {/* 모달 헤더 */}
          <div className="modal-header">
            <h1 className="modal-title">{title}</h1>
            <IconButton
              src="/images/modal_button_close.png"
              width="24"
              height="24"
              onClick={handleClose}
              className="modal-close-btn"
            />
          </div>

          <div className="modal-container">
            <img src={imageUrl} alt={title} className="modal-image" />
            <div className="modal-description">
              {/* 영화 정보 섹션 */}
              <div className="movie-info-line">
                <span className="movie-meta">{genreNames}</span>
                <div className="movie-rating">
                  <img src="/images/star_filled.png" width="16" height="16" />
                  <span className="rating-value">
                    {vote_average.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* 줄거리 */}
              <div className="overview-section">
                <p className="overview-text">
                  {overview || "줄거리 정보가 없습니다."}
                </p>
              </div>

              {/* 내 별점 섹션 */}
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
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  MovieDetailPageProps
> = async (context) => {
  const { movieId } = context.params as { movieId: string };

  try {
    const response = await moviesApi.getDetail(Number(movieId));
    const movie = response.data;

    return {
      props: {
        movie,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
