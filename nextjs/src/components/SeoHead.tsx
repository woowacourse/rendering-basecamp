import Head from "next/head";

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SeoHead = ({
  title = "영화 추천 사이트",
  description = "최신 인기 영화 정보를 제공합니다.",
  image = "https://my-movie-app.com/default-og-image.png",
  url = "https://my-movie-app.com",
}: SeoHeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${title} 포스터`} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="My Movie App" />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${title} 포스터`} />
      <meta name="twitter:site" content="@my_movie_app" />
    </Head>
  );
};
