import type { MovieDetailResponse } from '../types/MovieDetail.types';
import { useMovieRating } from '../hooks/useMovieRating';
import { IconButton } from './common/IconButton';

interface MovieDetailModalProps {
  movie: MovieDetailResponse;
  onClose: () => void;
}

const SCORE_TEXT: Record<number, string> = {
  2: '최악이에요',
  4: '별로예요',
  6: '보통이에요',
  8: '재미있어요',
  10: '명작이에요',
};

export const MovieDetailModal = ({ movie, onClose }: MovieDetailModalProps) => {
  const { rating, setRating } = useMovieRating(movie.id, movie.title);

  const { title, genres, overview, vote_average, poster_path } = movie;

  const genreNames = genres.map((genre) => genre.name).join(', ');
  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : '/static/images/no_image.png';

  const handleStarClick = (score: number) => {
    setRating(score);
  };

  return (
    <div className="modal-background active">
      <div className="modal">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h1 className="modal-title">{title}</h1>
          <IconButton
            src="/static/images/modal_button_close.png"
            width="24"
            height="24"
            onClick={onClose}
            className="modal-close-btn"
          />
        </div>

        <div className="modal-container">
          <img
            src={imageUrl}
            alt={title}
            className="modal-image"
          />
          <div className="modal-description">
            {/* 영화 정보 섹션 */}
            <div className="movie-info-line">
              <span className="movie-meta">{genreNames}</span>
              <div className="movie-rating">
                <img
                  src="/static/images/star_filled.png"
                  width="16"
                  height="16"
                />
                <span className="rating-value">{vote_average.toFixed(1)}</span>
              </div>
            </div>

            {/* 줄거리 */}
            <div className="overview-section">
              <p className="overview-text">{overview || '줄거리 정보가 없습니다.'}</p>
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
                        src={isFilled ? '/static/images/star_filled.png' : '/static/images/star_empty.png'}
                        width="24"
                        height="24"
                        onClick={() => handleStarClick(starScore)}
                        alt={`Star ${index + 1}`}
                      />
                    );
                  })}
                  <span className="rating-text">
                    {rating} {SCORE_TEXT[rating] ?? '별점을 남겨주세요'}
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
