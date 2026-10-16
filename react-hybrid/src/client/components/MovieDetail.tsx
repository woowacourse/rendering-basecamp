import type { MovieDetailResponse } from '../types/MovieDetail.types';
import { MovieDetailContent } from './MovieDetailContent';
import { Footer } from './Footer';
import { Link } from './common/Link';

export const MovieDetail = ({ movie }: { movie: MovieDetailResponse }) => {
    const { title, tagline, release_date, runtime, backdrop_path } = movie;

    const backdropUrl = backdrop_path ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${backdrop_path}` : undefined;
    const releaseYear = release_date?.slice(0, 4);

    return (
        <div id="wrap">
            <header>
                <div
                    className="background-container detail-background"
                    style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : undefined}
                >
                    <div className="overlay" />

                    <div className="top-rated-container">
                        <Link to="/" className="logo">
                            <img src="/images/logo.png" width="117" height="20" alt="MovieLogo" />
                        </Link>

                        <div className="detail-hero">
                            <h1 className="text-3xl font-semibold">{title}</h1>
                            {tagline && <p className="detail-tagline">{tagline}</p>}
                            <p className="detail-sub">
                                {[releaseYear, runtime ? `${runtime}분` : null].filter(Boolean).join(' · ')}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <section className="container">
                    <div className="detail-card">
                        <MovieDetailContent movie={movie} />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};
