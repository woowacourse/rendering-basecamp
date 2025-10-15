import Head from "next/head";
import type { MovieDetailResponse } from "@/types/MovieDetail.types";

interface MetaTagProps {
  pageUrl: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  movie?: MovieDetailResponse;
  siteName?: string;
  noindex?: boolean;
  locale?: string;
}

export const MetaData = ({
  pageUrl,
  title = "무비 리스트",
  description = "지금 인기 있는 영화를 추천하는 사이트입니다.",
  imageUrl,
  movie,
  siteName = "무비 리스트",
  noindex = false,
  locale = "ko_KR",
}: MetaTagProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta
        name='robots'
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      <link rel='icon' href='/favicon.ico' />
      {pageUrl && <link rel='canonical' href={pageUrl} />}

      <meta property='og:locale' content={locale} />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      {pageUrl && <meta property='og:url' content={pageUrl} />}
      {imageUrl && <meta property='og:image' content={imageUrl} />}
      {movie?.title && <meta property='og:image:alt' content={movie?.title} />}

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      {imageUrl && <meta name='twitter:image' content={imageUrl} />}
      {movie?.title && <meta name='twitter:image:alt' content={movie?.title} />}
    </Head>
  );
};
