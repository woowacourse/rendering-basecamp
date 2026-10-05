import type { MovieItem as MovieItemType } from '../types/Movie.types';

interface MovieItemProps {
  movie: MovieItemType;
  onClick: (movie: MovieItemType) => void;
  ref?: React.Ref<HTMLLIElement>;
}

export const MovieItem = ({ movie, onClick, ref }: MovieItemProps) => {
  const { title, poster_path, vote_average } = movie;

  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : '/images/no_image.png';

  const handleClick = () => {
    onClick(movie);
  };

  // 크롤러가 상세 페이지를 발견할 수 있도록 href를 두되, 일반 클릭은 기존처럼 모달을 연다.
  // 새 탭 열기(⌘/Ctrl/Shift + 클릭)는 브라우저 기본 동작에 맡긴다.
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      e.stopPropagation();
      return;
    }
    e.preventDefault();
  };

  return (
    <li
      ref={ref}
      className="movie-item"
      onClick={handleClick}
      data-index={movie.id}
    >
      <a className="item" href={`/detail/${movie.id}`} onClick={handleLinkClick}>
        <img className="thumbnail" src={imageUrl} alt={title} loading="lazy" />
        <div className="item-desc">
          <p className="rate">
            <img src="/images/star_empty.png" className="star" />
            <span>{vote_average.toFixed(1)}</span>
          </p>
          <strong>{title}</strong>
        </div>
      </a>
    </li>
  );
};

MovieItem.displayName = 'MovieItem';
