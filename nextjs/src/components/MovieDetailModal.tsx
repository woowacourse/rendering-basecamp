import type { MovieDetailResponse } from '../types/MovieDetail.types';
import { useMovieRating } from '../hooks/useMovieRating';
import { IconButton } from './common/IconButton';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { movieImageUrl } from '@/utils/movieImage';

interface MovieDetailModalProps {
  movie: MovieDetailResponse;
}

const SCORE_TEXT: Record<number, string> = {
  2: '최악이에요',
  4: '별로예요',
  6: '보통이에요',
  8: '재미있어요',
  10: '명작이에요',
};

export const MovieDetailModal = ({ movie }: MovieDetailModalProps) => {
  const { rating, setRating } = useMovieRating(movie.id, movie.title);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // DOM 접근과 세션 별점은 hydration 이후 브라우저에서만 처리합니다.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modalRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') void router.replace('/');
      if (event.key !== 'Tab') return;

      const controls = modalRef.current?.querySelectorAll<HTMLElement>('a, button');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [router]);

  const { title, genres, overview, vote_average, poster_path } = movie;

  const genreNames = genres.map(genre => genre.name).join(', ');
  const imageUrl = movieImageUrl(poster_path);

  const handleStarClick = (score: number) => {
    setRating(score);
  };

  return (
    <div className="modal-background active">
      <div ref={modalRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="movie-detail-title">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h1 id="movie-detail-title" className="modal-title">{title}</h1>
          <Link href="/" replace prefetch={false} className="modal-close-btn" aria-label="상세 정보 닫기">
            <Image src="/images/modal_button_close.png" width={24} height={24} alt="" />
          </Link>
        </div>

        <div className="modal-container">
          <Image src={imageUrl} alt={title} className="modal-image" width={280} height={420} sizes="(max-width: 480px) 1px, (max-width: 768px) 200px, 280px" priority />
          <div className="modal-description">
            {/* 영화 정보 섹션 */}
            <div className="movie-info-line">
              <span className="movie-meta">{genreNames}</span>
              <div className="movie-rating">
                <Image src="/images/star_filled.png" width={16} height={16} alt="평점" />
                <span className="rating-value">{vote_average.toFixed(1)}</span>
              </div>
            </div>

            {/* 줄거리 */}
            <div className="overview-section">
              <p className="overview-text">
                {overview || '줄거리 정보가 없습니다.'}
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
                            ? '/images/star_filled.png'
                            : '/images/star_empty.png'
                        }
                        width="24"
                        height="24"
                        onClick={() => handleStarClick(starScore)}
                        alt={`${index + 1}점`}
                        aria-label={`별점 ${index + 1}점`}
                        aria-pressed={starScore === rating}
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
