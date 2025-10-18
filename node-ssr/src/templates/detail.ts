interface Genre {
  id: number;
  name: string;
}

interface MovieDetail {
  title: string;
  genres: Genre[];
  overview: string;
  vote_average: number;
  poster_path: string | null;
}

export const detailTemplate = (movie: MovieDetail): string => {
  const { title, genres, overview, vote_average, poster_path } = movie;

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div class="modal-background active">
          <div class="modal">
            <!-- 모달 헤더 -->
            <div class="modal-header">
              <h1 class="modal-title">${title}</h1>
              <img src="/images/modal_button_close.png" width="24" height="24" class="modal-close-btn" alt="Close" />
            </div>

            <div class="modal-container">
              <img src="${
                poster_path
                  ? `https://image.tmdb.org/t/p/original${poster_path}`
                  : "/images/no_image.png"
              }" alt="${title}" class="modal-image" />
              <div class="modal-description">
                <!-- 영화 정보 섹션 -->
                <div class="movie-info-line">
                  <span class="movie-meta">${genres
                    .map((genre) => genre.name)
                    .join(", ")}</span>
                  <div class="movie-rating">
                    <img src="/images/star_filled.png" width="16" height="16" />
                    <span class="rating-value">${vote_average.toFixed(1)}</span>
                  </div>
                </div>

                <!-- 줄거리 -->
                <div class="overview-section">
                  <p class="overview-text">
                    ${overview || "줄거리 정보가 없습니다."}
                  </p>
                </div>

                <!-- 내 별점 섹션 -->
                <div class="my-rating-section">
                  <div class="rating-header">
                    <span class="rating-label">내 별점</span>
                    <div class="star-rating">
                      ${Array.from({ length: 5 }, (_, index) => {
                        return `<img
                            src="/images/star_empty.png"
                            width="24"
                            height="24"
                            alt="Star${index + 1}"
                          />`;
                      }).join("")}
                      <span class="rating-text">별점을 등록해주세요.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
