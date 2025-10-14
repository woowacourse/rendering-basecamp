import type { MovieDetailResponse } from "@/types/MovieDetail.types";
import { useMovieRating } from "@/hooks/useMovieRating";
import { IconButton } from "@/components/common/IconButton";
import Image from "next/image";
import styles from "./MovieDetailModal.module.css";

interface MovieDetailModalProps {
  movie: MovieDetailResponse;
  onClose: () => void;
}

const SCORE_TEXT: Record<number, string> = {
  2: "최악이에요",
  4: "별로예요",
  6: "보통이에요",
  8: "재미있어요",
  10: "명작이에요",
};

export const MovieDetailModal = ({ movie, onClose }: MovieDetailModalProps) => {
  const { rating, setRating } = useMovieRating(movie.id, movie.title);

  const { title, genres, overview, vote_average, poster_path } = movie;

  const genreNames = genres.map((genre) => genre.name).join(", ");
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/original${poster_path}`
    : "/images/no_image.png";

  const handleStarClick = (score: number) => {
    setRating(score);
  };

  return (
    <div className={`${styles.modalBackground} ${styles.active}`}>
      <div className={styles.modal}>
        {/* 모달 헤더 */}
        <div className={styles.modalHeader}>
          <h1 className={styles.modalTitle}>{title}</h1>
          <IconButton
            src="/images/modal_button_close.png"
            width={24}
            height={24}
            onClick={onClose}
            className={styles.modalCloseBtn}
          />
        </div>

        <div className={styles.modalContainer}>
          <Image
            src={imageUrl}
            alt={title}
            className={styles.modalImage}
            width={280}
            height={420}
          />
          <div className={styles.modalDescription}>
            {/* 영화 정보 섹션 */}
            <div className={styles.movieInfoLine}>
              <span className={styles.movieMeta}>{genreNames}</span>
              <div className={styles.movieRating}>
                <Image
                  src="/images/star_filled.png"
                  width={16}
                  height={16}
                  alt="filled star"
                />
                <span className={styles.ratingValue}>{vote_average.toFixed(1)}</span>
              </div>
            </div>

            {/* 줄거리 */}
            <div className={styles.overviewSection}>
              <p className={styles.overviewText}>
                {overview || "줄거리 정보가 없습니다."}
              </p>
            </div>

            {/* 내 별점 섹션 */}
            <div className={styles.myRatingSection}>
              <div className={styles.ratingHeader}>
                <span className={styles.ratingLabel}>내 별점</span>
                <div className={styles.starRating}>
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
                        width={24}
                        height={24}
                        onClick={() => handleStarClick(starScore)}
                        alt={`Star ${index + 1}`}
                      />
                    );
                  })}
                  <span className={styles.ratingText}>
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
};
