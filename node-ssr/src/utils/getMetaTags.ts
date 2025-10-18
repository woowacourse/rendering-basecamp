import { Movie } from '../service/types';

interface GetMetaTagsParams {
  title: string;
  description: string;
  imageUrl: string;
  pageUrl: string;
}

export const getMetaTagsHTML = ({
  title,
  description,
  imageUrl,
  pageUrl,
}: GetMetaTagsParams) => `
  <title>${title}</title>
  <meta name="description" content='${description}' />

  <meta property="og:title" content='${title}' />
  <meta property="og:description" content='${description}' />
  <meta property="og:image" content='${imageUrl}' />
  <meta property="og:url" content='${pageUrl}' />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content='${title}' />
  <meta name="twitter:description" content='${description}' />
  <meta name="twitter:image" content='${imageUrl}' />
  <meta name="twitter:url" content='${pageUrl}' />
`;

export const getMovieListHTML = (movies: Movie[]) =>
  movies
    .map(
      (movie) => `
        <li class="movie-item">
          <div class="item">
            <img class="thumbnail" src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}" alt="${movie.title}" loading="lazy" />
            <div class="item-desc">
              <p class="rate">
                <img src="/images/star_empty.png" class="star" />
                <span>${movie.vote_average.toFixed(1)}</span>
              </p>
              <strong>${movie.title}</strong>
            </div>
          </div>
        </li>
      `,
    )
    .join('');
