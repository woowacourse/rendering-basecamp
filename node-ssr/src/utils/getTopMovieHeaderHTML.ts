import { Movie } from "../service/types";

export const getTopMovieHeaderHTML = (topMovie: Movie) => `
  <header>  
    <div 
      class="background-container" 
      style="background-image: url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${
        topMovie.backdrop_path
      });">
      <div class="overlay"></div>
      <div class="top-rated-container">
        <img 
          src="/images/logo.png" 
          width="117" 
          height="20" 
          class="logo" 
          alt="MovieLogo" 
        />
        <div class="top-rated-movie">
          <div class="rate">
            <img 
              src="/images/star_empty.png" 
              width="32" 
              height="32" 
              alt="star icon" 
            />
            <span class="text-2xl font-semibold text-yellow">
              ${topMovie.vote_average.toFixed(1)}
            </span>
          </div>
          <h1 class="text-3xl font-semibold">${topMovie.title}</h1>
          <button 
            class="primary detail" 
            onclick="location.href='/detail/${topMovie.id}'"
          >
            자세히 보기
          </button>
        </div>
      </div>
    </div>
  </header>
`;
