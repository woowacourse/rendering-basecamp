// 서버가 data-* 속성으로 심어둔 값(movieId, movieName, score)을 읽어 별점 인터랙션을 붙인다.
const STORAGE_KEY = 'movie-ratings';

const SCORE_TEXT = {
    2: '최악이에요',
    4: '별로예요',
    6: '보통이에요',
    8: '재미있어요',
    10: '명작이에요',
};

const getRatings = () => {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
        return [];
    }
};

const saveRatings = (ratings) => {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    } catch (error) {
        console.error('Failed to save ratings:', error);
    }
};

const paintStars = (starRating, rate) => {
    starRating.querySelectorAll('[data-score]').forEach((star) => {
        const isFilled = Number(star.dataset.score) <= rate;
        star.src = isFilled ? '/images/star_filled.png' : '/images/star_empty.png';
    });

    starRating.querySelector('.rating-text').textContent = SCORE_TEXT[rate]
        ? `${rate} ${SCORE_TEXT[rate]}`
        : '별점을 남겨주세요';
};

const starRating = document.querySelector('.star-rating');

if (starRating) {
    const movieId = Number(starRating.dataset.movieId);
    const movieName = starRating.dataset.movieName;

    // 서버는 사용자의 별점을 모르므로 빈 별로 그려 보내고, 저장된 값은 여기서 채운다.
    const saved = getRatings().find((item) => item.movieId === movieId);
    paintStars(starRating, saved?.rate ?? 0);

    starRating.addEventListener('click', (event) => {
        const star = event.target.closest('[data-score]');
        if (!star) return;

        const rate = Number(star.dataset.score);
        const ratings = getRatings();
        const existing = ratings.find((item) => item.movieId === movieId);

        if (existing) {
            existing.rate = rate;
        } else {
            ratings.push({ movieId, movieName, rate, rateDate: new Date() });
        }

        saveRatings(ratings);
        paintStars(starRating, rate);
    });
}
